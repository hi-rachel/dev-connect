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
  UserProfileNoPhoto,
  UserProfilePhoto,
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
} from "../../constants/constants";

// [TODO]
// - [x] tags 등록 추가
// - [ ] 0시간 전 등 글 작성 시간 추가
// - [x] 각 개인별 like 여부 관리
// - [x] likes cnt 관리
// - [ ] 서버 상태 즉시 반영
// - [x] 기존 tweet docs명 변경, 데이터 새로 관리
// - [x] Delete, Edit -> Icon으로 변경하기
// - [ ] 글 클릭시 크게 보기 추가
// - Post 로직 편하게 수정하기 -
// - [x] Add Photo -> 카메라 아이콘, 미리보기 추가!

export default function Post({
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
}: IPost) {
  const user = auth.currentUser;
  const userTimeZone = "Asia/Seoul";
  const localTime = moment.utc(createdAt).tz(userTimeZone);
  const formattedDate12Hour = localTime.format("h:mm A · MMM D, YYYY");
  const [edit, setEdit] = useState(false);
  const [editPost, setEditPost] = useState(content);
  const [file, setFile] = useState<File | null>(null);
  const [originalPhoto, setOriginalPhoto] = useState<string | null>(null);
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

  const onDelete = async () => {
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

  const onPostChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditPost(e.target.value);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const onEdit = async () => {
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

      console.log(editPost.length);

      if (editPost.length > MAX_POST_CHARACTER_SIZE) {
        alert(
          `Please keep your message under ${MAX_POST_CHARACTER_SIZE} characters.`
        );
        return;
      }

      if (editPost.length < 2) {
        alert("Please write your message more than 2 characters.");
        return;
      }

      await updateDoc(doc(db, "posts", postId), {
        content: editPost,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setEdit(false);
    }
  };

  const onDeletePostImg = async () => {
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
          {userImg ? (
            <UserProfilePhoto src={userImg} alt="user-profile-image" />
          ) : (
            <UserProfileNoPhoto />
          )}

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
                      onChange={onFileChange}
                      id="file"
                      accept="image/*"
                      type="file"
                    />
                  </>
                )}
              </div>
              <EditPostButton onClick={onEdit}>
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
              <DeletePostButton onClick={onDelete}>
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
              onChange={onPostChange}
              value={editPost}
            />
          ) : (
            <Payload>{content}</Payload>
          )}
          {edit ? (
            <>
              <DeletePostImg onClick={onDeletePostImg}>
                {originalPhoto && <Photo src={originalPhoto} />}
                <DeletePostIcon>
                  <RiDeleteBin6Line size={30} />
                </DeletePostIcon>
              </DeletePostImg>
            </>
          ) : (
            <PostImg>{originalPhoto && <Photo src={originalPhoto} />}</PostImg>
          )}

          {tags.length >= 1 && (
            <TagWrapper>
              {tags.length >= 1 &&
                tags.map((tag, index) => <Tag key={index}>{tag}</Tag>)}
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
}
