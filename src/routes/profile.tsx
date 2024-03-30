import { styled } from "styled-components";
import { auth, db, storage } from "../firebase";
import { useEffect, useState } from "react";
import { COLORS } from "../constants/color";
import { FONTS } from "../constants/font";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";
import { TextArea } from "../components/common-components";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;

const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: ${COLORS.primary};
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;

const AvartarImg = styled.img`
  width: 100%;
  height: 100%;
`;

const AvartarInput = styled.input`
  display: none;
`;

const UsernameSpace = styled.form`
  display: flex;
  align-items: center;
`;

const Username = styled.div`
  font-size: ${FONTS.xl};
`;

const EditUsernameTextArea = styled(TextArea)`
  width: fit-content;
  padding: 5px;
`;

const EditUsernameIcon = styled.div`
  width: 22px;
  height: 22px;
  margin-right: 8px;
`;

const SaveUsernameIcon = styled(EditUsernameIcon)`
  width: 32px;
  height: 32px;
`;

const Tweets = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export default function Profile() {
  const user = auth.currentUser;
  const [myTweets, setMyTweets] = useState<ITweet[]>([]);
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [newUsername, setNewUsername] = useState(
    user?.displayName ?? "Anonymous"
  );
  const [editUsername, setEditUsername] = useState(false);

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    const { files } = e.target;
    const maxSize = 1024 * 1024;
    if (files && files.length === 1 && files[0].size <= maxSize) {
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avatarURL = await getDownloadURL(result.ref);
      setAvatar(avatarURL);
      await updateProfile(user, {
        photoURL: avatarURL,
      });
    } else {
      alert("Please upload a picture smaller than 1 MB.");
    }
  };

  const onUsernameKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onUsernameSave();
    }
  };

  const onUsernameChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewUsername(e.target.value);
  };

  const onUsernameEdit = () => {
    setEditUsername(true);
  };

  const onUsernameSave = async () => {
    if (!user || !setEditUsername) return;
    if (newUsername.length < 2) {
      alert("Please enter a username with a least 2 characters.");
      setEditUsername(false);
      return;
    }
    try {
      await updateProfile(user, {
        displayName: newUsername,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setEditUsername(false);
    }
  };

  const fetchTweets = async () => {
    const tweetQuery = query(
      collection(db, "tweets"),
      where("userId", "==", user?.uid),
      orderBy("createdAt", "desc"),
      limit(25)
    );
    const snapshot = await getDocs(tweetQuery);
    const tweets = snapshot.docs.map((doc) => {
      const { tweet, createdAt, userId, photo, username } = doc.data();
      return {
        id: doc.id,
        tweet,
        createdAt,
        userId,
        username,
        photo,
      };
    });
    setMyTweets(tweets);
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {avatar ? (
          <AvartarImg src={avatar} alt="avatar" />
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
      </AvatarUpload>
      <AvartarInput
        onChange={onAvatarChange}
        id="avatar"
        type="file"
        accept="image/*"
      />
      <UsernameSpace>
        {editUsername ? (
          <SaveUsernameIcon onClick={onUsernameSave}>
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </SaveUsernameIcon>
        ) : (
          <EditUsernameIcon onClick={onUsernameEdit}>
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
              />
            </svg>
          </EditUsernameIcon>
        )}
        {editUsername ? (
          <EditUsernameTextArea
            rows={1}
            maxLength={20}
            onChange={onUsernameChange}
            value={newUsername}
            onKeyDown={onUsernameKeyDown}
          />
        ) : (
          <Username>{newUsername}</Username>
        )}
      </UsernameSpace>
      <Tweets>
        {myTweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} username={newUsername} />
        ))}
      </Tweets>
    </Wrapper>
  );
}
