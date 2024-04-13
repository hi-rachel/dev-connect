import { styled } from "styled-components";
import { ITweet } from "./timeline";
import { FONTS, FONTS_WEIGHT } from "../constants/font";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { EditButton, TextArea, AttachFileInput } from "./common-components";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border-radius: 15px;
  height: auto;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;

  @media (prefers-color-scheme: dark) {
    box-shadow: rgba(255, 255, 255, 0.2) 0px 4px 12px;
    border: 1px solid var(--gray);
  }
`;

const Column = styled.div``;

const EditTextArea = styled(TextArea)`
  margin-right: 20px;
  margin-bottom: 20px;
  width: 90%;
`;

const Photo = styled.img`
  width: 100%;
  border-radius: 15px;
`;

const UserWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const Username = styled.p`
  font-weight: ${FONTS_WEIGHT.semiBold};
`;

const UserProfilePhoto = styled.img`
  width: 36px;
  border-radius: 50%;
`;

const UserProfileNoPhoto = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--primary);
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: ${FONTS.lg};
`;

const DeleteTweetButton = styled(EditButton)`
  background-color: var(--danger);
  color: var(--foreground);
  margin-right: 15px;
`;

const EditTweetButton = styled(EditButton)`
  background-color: var(--success);
`;

const ChangeFileInput = styled(AttachFileInput)``;

const ChangeFileButton = styled(EditButton)`
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  svg {
    height: 15px;
    margin-right: 5px;
  }
`;

const TweetDate = styled.div`
  margin-top: 15px;
`;

export default function Tweet({
  username,
  photo,
  tweet,
  userId,
  id,
  createdAt,
  userImg,
}: ITweet) {
  const user = auth.currentUser;

  const date = createdAt.substring(0, 10);
  const [edit, setEdit] = useState(false);
  const [editTweet, setEditTweet] = useState(tweet);
  const [file, setFile] = useState<File | null>(null);
  const [originalPhoto, setOriginalPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setOriginalPhoto(photo || null);
  }, [photo]);

  const onDelete = async () => {
    const ok = window.confirm("Are you sure you want to delete this tweet?");

    if (!ok || user?.uid !== userId) return;

    try {
      await deleteDoc(doc(db, "tweets", id));

      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onTweetChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditTweet(e.target.value);
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
        const locationRef = ref(storage, `tweets/${user.uid}/${id}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        setOriginalPhoto(url);
        await updateDoc(doc(db, "tweets", id), {
          photo: url,
        });
      }

      if (editTweet.length < 2) {
        alert("Please write your tweet.");
        return;
      }

      await updateDoc(doc(db, "tweets", id), {
        tweet: editTweet,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setEdit(false);
    }
  };

  return (
    <Wrapper>
      <Column>
        <UserWrapper>
          {userImg ? (
            <UserProfilePhoto src={userImg} alt="user-profile-image" />
          ) : (
            <UserProfileNoPhoto />
          )}

          <Username>{username}</Username>
        </UserWrapper>
        {edit ? (
          <EditTextArea
            rows={5}
            maxLength={180}
            onChange={onTweetChange}
            value={editTweet}
          />
        ) : (
          <Payload>{tweet}</Payload>
        )}
        {user?.uid === userId ? (
          <>
            <DeleteTweetButton onClick={onDelete}>Delete</DeleteTweetButton>
            <EditTweetButton onClick={onEdit}>
              {edit ? "Save" : "Edit"}
            </EditTweetButton>
          </>
        ) : null}
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
      <TweetDate>{date}</TweetDate>
    </Wrapper>
  );
}
