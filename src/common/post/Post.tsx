import React, { useEffect, useRef, useState } from "react";
import { auth, db, storage } from "../../firebase";
import { deleteDoc, deleteField, doc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { FaBookmark, FaHeart } from "react-icons/fa";
import {
  ChangeFileButton,
  ChangeFileInput,
  DeletePostButton,
  EditPostButton,
  EditTextArea,
  Payload,
  PostDate,
  PostFooter,
  TagWrapper,
  UserWrapper,
  Username,
  PostWrapper,
  LikesCount,
  PostControls,
  FooterControls,
  PostContents,
} from "./Post.styled";
import { IPost } from "../../type/post";
import moment from "moment-timezone";
import { MdAddAPhoto, MdOutlineModeEdit } from "react-icons/md";
import { FaRegCheckCircle } from "react-icons/fa";
import { IoCameraReverseSharp, IoClose } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Photo } from "../form/Form.styled";
import { DeletePostIcon, DeletePostImg, PostImg } from "./Post.styled";
import { Tag } from "../common.styled";
import {
  MAX_POST_CHARACTER_SIZE,
  MAX_UPLOAD_SIZE,
  USER_TIMEZONE,
} from "../../constants/constants";
import {
  TagInput,
  TagInputArea,
} from "../../pages/home/new-post-form/NewPostForm.styled";
import LinkifiedText from "./LikifiedText";
import { AvartarImg, PostAvatarCircle } from "../user/Avatar";

// [TODO]
// - [x] tags 등록 추가
// - [ ] 0시간 전 등 글 작성 시간 추가
// - [x] 각 개인별 like 여부 관리
// - [x] likes cnt 관리
// - [x] 서버 상태 즉시 반영
// - [x] 기존 tweet docs명 변경, 데이터 새로 관리
// - [x] Delete, Edit -> Icon으로 변경하기
// - [ ] 글 클릭시 크게 보기 추가
// - [x] Add Photo -> 카메라 아이콘, 미리보기 추가!

interface PostProps {
  setSearchKeyword?: (keyword: string) => void;
  setFilterTag?: (tag: string) => void;
  activeTag?: string;
}

const Post = ({
  setFilterTag,
  postId,
  userName,
  userId,
  userImg,
  content,
  createdAt,
  postImg,
  tags,
  bookmarkedBy,
  likedBy,
  activeTag,
}: IPost & PostProps) => {
  const user = auth.currentUser;
  const localTime = moment.utc(createdAt).tz(USER_TIMEZONE);
  const formattedDate12Hour = localTime.format("h:mm A · MMM D, YYYY");
  const [edit, setEdit] = useState(false);
  const [editPost, setEditPost] = useState(content);
  const [file, setFile] = useState<File | null>(null);
  const [originalPhoto, setOriginalPhoto] = useState<string | null>(null);
  const [editTags, setEditTags] = useState<string[]>(tags || []);
  const [tagInput, setTagInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHeartClick, setIsHeartClick] = useState(false);
  const [isBookmark, setIsBookmark] = useState(false);

  useEffect(() => {
    if (user) {
      setIsHeartClick(likedBy.includes(user.uid));
      setIsBookmark(bookmarkedBy.includes(user.uid));
    }
  }, [likedBy, bookmarkedBy, user?.uid]);

  useEffect(() => {
    setOriginalPhoto(postImg || null);
  }, [postImg]);

  if (!user) return;

  const handleDelete = async () => {
    const ok = window.confirm("Are you sure you want to delete this Post?");

    if (!ok || user?.uid !== userId) return;

    try {
      await deleteDoc(doc(db, "posts", postId));

      if (postImg) {
        const photoRef = ref(storage, `posts/${user.uid}/${postId}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handlePostChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditPost(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (files && files.length === 1 && files[0].size <= MAX_UPLOAD_SIZE) {
      const newFile = files[0];
      setFile(newFile);

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataURL = e.target?.result as string;
        setOriginalPhoto(dataURL);
      };
      reader.readAsDataURL(newFile);
    } else {
      alert("Please upload a picture smaller than 1 MB.");
      setFile(null);
    }
  };

  const handleEdit = async () => {
    setEdit(true);
    if (!edit) return;

    try {
      if (file) {
        const locationRef = ref(storage, `posts/${user.uid}/${postId}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        setOriginalPhoto(url);
        await updateDoc(doc(db, "posts", postId), {
          postImg: url,
        });
      }

      if (editPost.length > MAX_POST_CHARACTER_SIZE) {
        alert(
          `Please keep your message under ${MAX_POST_CHARACTER_SIZE} characters.`
        );
        setEdit(false);
        setEditPost(content);
        return;
      }

      if (editPost.length < 2) {
        alert("Please write your message more than 2 characters.");
        setEdit(false);
        setEditPost(content);
        return;
      }

      await updateDoc(doc(db, "posts", postId), {
        content: editPost,
        tags: editTags,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setEdit(false);
    }
  };

  const handleDeletePostImg = async () => {
    try {
      if (confirm("Are you sure you want to delete this photo?")) {
        if (file) {
          setFile(null);
          setOriginalPhoto(null);
          return;
        }

        if (postImg) {
          const photoRef = ref(storage, `posts/${user.uid}/${postId}`);
          await deleteObject(photoRef);
          await updateDoc(doc(db, "posts", postId), {
            postImg: deleteField(),
          });
          setOriginalPhoto(null);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      if (editTags.length >= 10) {
        alert("You can't add more than 10 tags.");
        setTagInput("");
        return;
      }
      const newTag = tagInput.trim().toLowerCase();
      if (editTags.map((tag) => tag.toLowerCase()).includes(newTag)) {
        alert("This tag is already added.");
        setTagInput("");
        return;
      }
      setEditTags((prevTags) => [...prevTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleTagRemove = (index: number) => {
    setEditTags((prevTags) => prevTags.filter((_, i) => i !== index));
  };

  const handleClickTag = (tag: string) => () => {
    if (setFilterTag) {
      if (activeTag === tag) {
        setFilterTag("");
      } else {
        setFilterTag(tag);
      }
    }
  };

  const handleClickHeart = async () => {
    try {
      const likedIndex = likedBy.indexOf(user.uid);
      const updatedLikedBy = [...likedBy];

      if (likedIndex === -1) {
        updatedLikedBy.push(user.uid);
      } else {
        updatedLikedBy.splice(likedIndex, 1);
      }

      await updateDoc(doc(db, "posts", postId), {
        likedBy: updatedLikedBy,
      });

      setIsHeartClick(!isHeartClick);
    } catch (error) {
      console.error("Error updating likedBy array:", error);
    }
  };

  const handleClickBookmark = async () => {
    // toast 알림 넣기
    try {
      const bookmarkedIndex = bookmarkedBy.indexOf(user.uid);
      const updatedbookmarkedBy = [...bookmarkedBy];

      if (bookmarkedIndex === -1) {
        updatedbookmarkedBy.push(user.uid);
      } else {
        updatedbookmarkedBy.splice(bookmarkedIndex, 1);
      }

      await updateDoc(doc(db, "posts", postId), {
        bookmarkedBy: updatedbookmarkedBy,
      });

      setIsBookmark(!isBookmark);
    } catch (error) {
      console.error("Error updating likedBy array:", error);
    }
  };

  return (
    <>
      <PostWrapper>
        <UserWrapper>
          <PostAvatarCircle>
            {userImg ? (
              <AvartarImg src={userImg} alt="user-profile-image" />
            ) : (
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
              </svg>
            )}
          </PostAvatarCircle>
          <Username>{userName}</Username>
          {user?.uid === userId ? (
            <PostControls>
              <div>
                {edit && (
                  <>
                    <ChangeFileButton
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {originalPhoto ? (
                        <IoCameraReverseSharp
                          aria-label="Change a photo"
                          size={25}
                        />
                      ) : (
                        <MdAddAPhoto aria-label="Add a photo" size={25} />
                      )}
                    </ChangeFileButton>
                    <ChangeFileInput
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      id="file"
                      accept="image/*"
                      type="file"
                    />
                  </>
                )}
              </div>
              <EditPostButton onClick={handleEdit}>
                {edit ? (
                  <FaRegCheckCircle
                    color="var(--success)"
                    aria-label="Fininsh editing"
                    size={25}
                  />
                ) : (
                  <MdOutlineModeEdit aria-label="Start editing" size={22} />
                )}
              </EditPostButton>
              <DeletePostButton onClick={handleDelete}>
                <IoClose aria-label="Delete" size={22} />
              </DeletePostButton>
            </PostControls>
          ) : null}
        </UserWrapper>
        <PostContents>
          {edit ? (
            <EditTextArea
              rows={10}
              maxLength={MAX_POST_CHARACTER_SIZE}
              onChange={handlePostChange}
              value={editPost}
            />
          ) : (
            <Payload>
              <LinkifiedText text={editPost} />
            </Payload>
          )}
          {edit ? (
            <>
              <DeletePostImg onClick={handleDeletePostImg}>
                {originalPhoto && <Photo src={originalPhoto} />}
                <DeletePostIcon>
                  <RiDeleteBin6Line size={30} />
                </DeletePostIcon>
              </DeletePostImg>
            </>
          ) : (
            <PostImg>{originalPhoto && <Photo src={originalPhoto} />}</PostImg>
          )}
          {edit ? (
            <TagInputArea>
              {editTags.map((tag, index) => (
                <Tag key={index}>
                  {tag}{" "}
                  <button onClick={() => handleTagRemove(index)}>x</button>
                </Tag>
              ))}
              <TagInput
                type="text"
                tabIndex={0}
                aria-label="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add tags, press Enter to add"
              />
            </TagInputArea>
          ) : (
            <TagWrapper>
              {editTags.length >= 1 &&
                editTags.map((tag, index) => (
                  <Tag
                    onClick={handleClickTag(tag)}
                    key={index}
                    active={activeTag === tag}
                  >
                    {tag}
                  </Tag>
                ))}
            </TagWrapper>
          )}
          <PostFooter>
            <PostDate>{formattedDate12Hour}</PostDate>
            <FooterControls>
              <LikesCount>
                <FaHeart
                  size={18}
                  color={isHeartClick ? "#5eead4" : "grey"}
                  onClick={handleClickHeart}
                />
                <p>{likedBy.length}</p>
              </LikesCount>
              <FaBookmark
                size={18}
                color={isBookmark ? "#5eead4" : "gray"}
                onClick={handleClickBookmark}
              />
            </FooterControls>
          </PostFooter>
        </PostContents>
      </PostWrapper>
    </>
  );
};

export default Post;
