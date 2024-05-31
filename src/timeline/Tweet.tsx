import { ITweet } from "./Timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import {
  ChangeFileButton,
  ChangeFileInput,
  Column,
  DeleteTweetButton,
  EditTextArea,
  EditTweetButton,
  Payload,
  Photo,
  TweetDate,
  UserProfileNoPhoto,
  UserProfilePhoto,
  UserWrapper,
  Username,
  Wrapper,
} from "./Tweet.styled";

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