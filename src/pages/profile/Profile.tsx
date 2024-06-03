import { useState, useEffect } from "react";
import { auth, db, storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Unsubscribe, updateProfile } from "firebase/auth";
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
  onSnapshot,
} from "firebase/firestore";
import { IPost } from "../../type/post";
import {
  AvartarImg,
  AvartarInput,
  AvatarUpload,
  EditUsernameIcon,
  EditUsernameTextArea,
  SaveUsernameIcon,
  Posts,
  Username,
  UsernameSpace,
  Wrapper,
} from "./Profile.styled";
import Post from "../../common/post/Post";
import { MAX_UPLOAD_SIZE, PAGE_SIZE } from "../../constants/constants";
import { FaRegCheckCircle } from "react-icons/fa";
import { MdOutlineModeEdit } from "react-icons/md";
import { Loader } from "../../common/common.styled";

export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [username, setUsername] = useState(user?.displayName || "Anonymous");
  const [newUsername, setNewUsername] = useState(username);
  const [editUsername, setEditUsername] = useState(false);
  const [myPosts, setMyPosts] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    const fetchPosts = async () => {
      setIsLoading(true);
      const postsQuery = query(
        collection(db, "posts"),
        where("userId", "==", user?.uid),
        orderBy("createdAt", "desc"),
        limit(PAGE_SIZE)
      );
      unsubscribe = await onSnapshot(postsQuery, (snapshot) => {
        const newPosts: IPost[] = [];
        snapshot.forEach((doc) => {
          const {
            userName,
            userId,
            userImg,
            content,
            createdAt,
            postImg,
            tags,
            bookmarkedBy,
            likedBy,
          } = doc.data();
          newPosts.push({
            postId: doc.id,
            userName,
            userId,
            userImg,
            content,
            createdAt,
            postImg,
            tags,
            bookmarkedBy,
            likedBy,
          });
        });
        setMyPosts(() => [...newPosts]);
        setIsLoading(false);
      });
    };

    fetchPosts();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    if (
      scrollTop + clientHeight + 100 >= scrollHeight &&
      !isLoading &&
      hasMoreData
    ) {
      fetchNextPosts();
    }
  };

  const fetchNextPosts = async () => {
    if (myPosts.length === 0) return;
    setIsLoading(true);
    const lastPost = myPosts[myPosts.length - 1];
    const postsQuery = query(
      collection(db, "posts"),
      where("userId", "==", user?.uid),
      orderBy("createdAt", "desc"),
      startAfter(lastPost?.createdAt),
      limit(PAGE_SIZE)
    );
    const snapshot = await getDocs(postsQuery);
    const newPosts: IPost[] = [];
    snapshot.forEach((doc) => {
      const {
        userName,
        userId,
        userImg,
        content,
        createdAt,
        postImg,
        tags,
        bookmarkedBy,
        likedBy,
      } = doc.data();
      newPosts.push({
        postId: doc.id,
        userName,
        userId,
        userImg,
        content,
        createdAt,
        postImg,
        tags,
        bookmarkedBy,
        likedBy,
      });
    });
    setMyPosts((prevPosts) => [...prevPosts, ...newPosts]);
    setIsLoading(false);
    if (snapshot.size < PAGE_SIZE) {
      setHasMoreData(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading, hasMoreData]);

  const updateUserProfile = async (newUsername: string) => {
    if (user) {
      await updateProfile(user, {
        displayName: newUsername,
      });
    } else {
      console.error("User information is not available.");
    }

    const userPostsQuery = query(
      collection(db, "posts"),
      where("userId", "==", user?.uid)
    );
    const querySnapshot = await getDocs(userPostsQuery);
    querySnapshot.forEach(async (document) => {
      await updateDoc(doc(db, "posts", document.id), {
        userName: newUsername,
      });
    });

    setUsername(newUsername);
  };

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    const { files } = e.target;
    if (files && files.length === 1 && files[0].size <= MAX_UPLOAD_SIZE) {
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avatarURL = await getDownloadURL(result.ref);
      setAvatar(avatarURL);
      console.log(user);
      await updateProfile(user, {
        photoURL: avatarURL,
      });

      const userPostsQuery = query(
        collection(db, "posts"),
        where("userId", "==", user?.uid)
      );
      const querySnapshot = await getDocs(userPostsQuery);
      querySnapshot.forEach(async (document) => {
        await updateDoc(doc(db, "posts", document.id), {
          userImg: avatarURL,
        });
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
        await updateUserProfile(newUsername);
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
      await updateUserProfile(newUsername);
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
          {editUsername ? (
            <SaveUsernameIcon onClick={onUsernameSave}>
              <FaRegCheckCircle
                color="var(--success)"
                aria-label="Fininsh editing"
                size={25}
              />
            </SaveUsernameIcon>
          ) : (
            <EditUsernameIcon onClick={onUsernameEdit}>
              <MdOutlineModeEdit aria-label="Start editing" size={22} />
            </EditUsernameIcon>
          )}
        </UsernameSpace>
        <Posts>
          {myPosts?.map((post, index) => (
            <Post key={`${post.postId}-${index}`} {...post} />
          ))}
        </Posts>
        {isLoading && <Loader>isLoading...</Loader>}
      </Wrapper>
    )
  );
}
