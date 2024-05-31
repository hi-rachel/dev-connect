import { useState, useEffect } from "react";
import { useMutation } from "react-query";
import { auth, db, storage } from "../firebase";

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
  updateDoc,
  doc,
  limit,
  startAfter,
} from "firebase/firestore";
import { ITweet } from "../timeline/Timeline";
import Tweet from "../timeline/Tweet";
import {
  AvartarImg,
  AvartarInput,
  AvatarUpload,
  EditUsernameIcon,
  EditUsernameTextArea,
  Loader,
  SaveUsernameIcon,
  Tweets,
  Username,
  UsernameSpace,
  Wrapper,
} from "./Profile.styled";

export default function Profile() {
  const user = auth.currentUser;

  if (!user) return null;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [username, setUsername] = useState(user.displayName || "Anonymous");
  const [newUsername, setNewUsername] = useState(username);
  const [editUsername, setEditUsername] = useState(false);
  const [myTweets, setMyTweets] = useState<ITweet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const pageSize = 5;

  useEffect(() => {
    fetchTweets();
  }, []);

  const fetchTweets = async () => {
    setIsLoading(true);
    const tweetsQuery = query(
      collection(db, "tweets"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(pageSize)
    );
    const snapshot = await getDocs(tweetsQuery);
    const fetchedTweets: ITweet[] = [];
    snapshot.forEach((doc) => {
      const { tweet, createdAt, userId, username, photo, userImg } = doc.data();
      fetchedTweets.push({
        id: doc.id,
        tweet,
        createdAt,
        userId,
        username,
        photo,
        userImg,
      });
    });
    setMyTweets(fetchedTweets);
    setIsLoading(false);
    if (snapshot.size < pageSize) {
      setHasMoreData(false);
    }
  };

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    if (
      scrollTop + clientHeight + 100 >= scrollHeight &&
      !isLoading &&
      hasMoreData
    ) {
      fetchNextTweets();
    }
  };

  const fetchNextTweets = async () => {
    setIsLoading(true);
    const lastTweet = myTweets[myTweets.length - 1];
    const tweetsQuery = query(
      collection(db, "tweets"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
      startAfter(lastTweet?.createdAt),
      limit(pageSize)
    );
    const snapshot = await getDocs(tweetsQuery);
    const newTweets: ITweet[] = [];
    snapshot.forEach((doc) => {
      const { tweet, createdAt, userId, username, photo, userImg } = doc.data();
      newTweets.push({
        id: doc.id,
        tweet,
        createdAt,
        userId,
        username,
        photo,
        userImg,
      });
    });
    setMyTweets((prevTweets) => [...prevTweets, ...newTweets]);
    setIsLoading(false);
    if (snapshot.size < pageSize) {
      setHasMoreData(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading, hasMoreData]);

  const updateUserProfile = useMutation(
    async (newUsername: string) => {
      await updateProfile(user, {
        displayName: newUsername,
      });

      // 사용자의 모든 트윗을 가져와서 각각 업데이트합니다.
      const userTweetsQuery = query(
        collection(db, "tweets"),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(userTweetsQuery);
      querySnapshot.forEach(async (document) => {
        await updateDoc(doc(db, "tweets", document.id), {
          username: newUsername,
        });
      });
    },
    {
      onSuccess: () => {
        setUsername(newUsername);
        fetchTweets(); // 프로필이름이 변경될 때마다 트윗 목록을 다시 가져옴
      },
    }
  );

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

  const onUsernameKeyDown = async (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (newUsername !== username) {
        await updateUserProfile.mutateAsync(newUsername);
      }
      setEditUsername(false);
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
      alert("Please enter a username with at least 2 characters.");
      setEditUsername(false);
      return;
    }
    if (newUsername !== username) {
      await updateUserProfile.mutateAsync(newUsername);
    }
    setEditUsername(false);
  };

  return (
    user &&
    user.displayName && (
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
            <Username>{username}</Username>
          )}
        </UsernameSpace>
        <Tweets>
          {myTweets?.map((tweet, index) => (
            <Tweet key={`${tweet.id}-${index}`} {...tweet} />
          ))}
        </Tweets>
        {isLoading && <Loader>isLoading...</Loader>}
      </Wrapper>
    )
  );
}
