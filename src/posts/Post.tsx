import React, { useEffect, useRef, useState } from "react";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
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
  Column,
  DeletePostButton,
  EditPostButton,
  EditTextArea,
  Payload,
  Photo,
  PostDate,
  PostFooter,
  Tag,
  TagWrapper,
  UserProfileNoPhoto,
  UserProfilePhoto,
  UserWrapper,
  Username,
  PostWrapper,
  PostGrid,
  LikesCount,
} from "./Post.styled";
// import { useMutation, useQueryClient } from "react-query";
import { IPost } from "../type/post";

// [TODO]
// - [ ] tags 등록 추가
// - [ ] 0시간 전 등 글 작성 시간 추가
// - [ ] 각 개인별 like 여부 관리
// - [ ] likes cnt 관리
// - [ ] 서버 상태 즉시 반영
// - [ ] 기존 tweet docs명 변경, 데이터 새로 관리
// - [ ] Delete, Edit -> Icon으로 변경하기
// - [ ] 글 클릭시 크게 보기 추가
// - Post 로직 편하게 수정하기 -
// - [ ] Add Photo -> 카메라 아이콘, 미리보기 추가!

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
  const date = createdAt.substring(0, 10);
  const [edit, setEdit] = useState(false);
  const [editPost, setEditPost] = useState(content);
  const [file, setFile] = useState<File | null>(null);
  const [originalPhoto, setOriginalPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHeartClick, setIsHeartClick] = useState(false);
  const [isBookmark, setIsBookmark] = useState(false);
  // const queryClient = useQueryClient();
  console.log(tags);

  useEffect(() => {
    setOriginalPhoto(postImg || null);
  }, [postImg]);

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

    const maxSize = 1024 * 768;

    if (files && files.length === 1 && files[0].size <= maxSize) {
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
    if (!edit || !user) return;

    try {
      if (file) {
        const locationRef = ref(storage, `posts/${user.uid}/${postId}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        setOriginalPhoto(url);
        await updateDoc(doc(db, "posts", postId), {
          photo: url,
        });
      }

      if (editPost.length < 2) {
        alert("Please write your Post.");
        return;
      }

      await updateDoc(doc(db, "posts", postId), {
        Post: editPost,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setEdit(false);
    }
  };

  // const { mutate: toggleLike } = useMutation(
  //   async () => {
  //     const PostRef = doc(db, "posts", postId);
  //     await updateDoc(PostRef, {
  //       likes: isHeartClick ? likes - 1 : likes + 1,
  //       like: !isHeartClick,
  //     });
  //   },
  //   {
  //     onSuccess: () => {
  //       queryClient.invalidateQueries("Posts");
  //     },
  //   }
  // );

  const handleClickHeart = () => {
    // like true면 false로 변환, cnt -= 1, show 하트 애니메이션
    // like false면 true로 변환 cnt += 1
    // setIsHeartClick((prevLike) => {
    //   const newLike = !prevLike;
    //   onClickHeart(newLike);
    //   return newLike;
    // });
    // toggleLike();
    // setIsHeartClick((prevLike) => !prevLike);
    // onClickHeart(!isHeartClick);
  };

  const handleClickBookmark = async () => {
    // toast 알림 넣기
    // setIsBookmark((prev) => !prev);
  };

  return (
    <>
      <PostWrapper>
        <PostGrid>
          <Column>
            <UserWrapper>
              {userImg ? (
                <UserProfilePhoto src={userImg} alt="user-profile-image" />
              ) : (
                <UserProfileNoPhoto />
              )}

              <Username>{userName}</Username>
            </UserWrapper>
            {edit ? (
              <EditTextArea
                rows={5}
                maxLength={180}
                onChange={onPostChange}
                value={editPost}
              />
            ) : (
              <Payload>{content}</Payload>
            )}
          </Column>
          <Column>
            {edit ? (
              <>
                <ChangeFileButton onClick={() => fileInputRef.current?.click()}>
                  {originalPhoto ? (
                    <>
                      <svg
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
                      </svg>
                      Edit
                    </>
                  ) : (
                    "Add Photo"
                  )}
                </ChangeFileButton>
                <ChangeFileInput
                  ref={fileInputRef}
                  onChange={onFileChange}
                  id="file"
                  accept="image/*"
                  type="file"
                />
                {originalPhoto && <Photo src={originalPhoto} />}
              </>
            ) : (
              originalPhoto && <Photo src={originalPhoto} />
            )}
          </Column>
          <PostDate>{date}</PostDate>
          <Column>
            {user?.uid === userId ? (
              <>
                <DeletePostButton onClick={onDelete}>Delete</DeletePostButton>
                <EditPostButton onClick={onEdit}>
                  {edit ? "Save" : "Edit"}
                </EditPostButton>
              </>
            ) : null}
          </Column>
        </PostGrid>
        <TagWrapper>
          {tags.length >= 1 &&
            tags.map((tag, index) => <Tag key={index}>{tag}</Tag>)}
        </TagWrapper>
        <PostFooter>
          <FaHeart
            size={18}
            color={isHeartClick ? "#5eead4" : "grey"}
            onClick={handleClickHeart}
          />
          <LikesCount>200</LikesCount>
          <FaBookmark
            size={18}
            color={isBookmark ? "#5eead4" : "gray"}
            onClick={handleClickBookmark}
          />
        </PostFooter>
      </PostWrapper>
    </>
  );
}
