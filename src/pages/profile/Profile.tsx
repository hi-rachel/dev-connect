import { useState, useEffect, KeyboardEvent, MouseEvent } from "react";
import { auth, db, storage } from "../../firebase";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
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
  deleteField,
} from "firebase/firestore";
import { IPost } from "../../type/post";
import {
  AvartarInput,
  AvatarUpload,
  EditUsernameIcon,
  EditUsernameTextArea,
  SaveUsernameIcon,
  Username,
  ProfileWrapper,
  EditUsernameForm,
  AvartarDiv,
  DeleteAvatarBtn,
} from "./Profile.styled";
import Post from "../../common/post/Post";
import { MAX_UPLOAD_SIZE, PAGE_SIZE } from "../../constants/constants";
import { FaRegCheckCircle } from "react-icons/fa";
import { MdOutlineModeEdit } from "react-icons/md";
import { Loader } from "../../common/loading/Loading.styled";
import { Posts } from "../../common/post/Post.styled";
import { AvartarImg } from "../../common/user/Avatar";
import { IoClose } from "react-icons/io5";

const Profile = () => {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL || null);
  const [newUsername, setNewUsername] = useState(
    user?.displayName || "Anonymous"
  );
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
      unsubscribe = onSnapshot(postsQuery, (snapshot) => {
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
        setMyPosts([...newPosts]);
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

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;

    const { files } = e.target;

    if (files && files.length === 1 && files[0].size <= MAX_UPLOAD_SIZE) {
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avatarURL = await getDownloadURL(result.ref);
      setAvatar(avatarURL);
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

  const handleAvatarDelete = async () => {
    const ok = window.confirm(
      "Are you sure you want to delete this profile image?"
    );

    if (!ok || !user) return;

    if (avatar === null) {
      alert("There is no profile image.");
    }

    try {
      const photoRef = ref(storage, `avatars/${user.uid}`);
      await deleteObject(photoRef);

      await updateProfile(user, {
        photoURL: "",
      });
      setAvatar(null);

      const userPostsQuery = query(
        collection(db, "posts"),
        where("userId", "==", user?.uid)
      );
      const querySnapshot = await getDocs(userPostsQuery);
      querySnapshot.forEach(async (document) => {
        await updateDoc(doc(db, "posts", document.id), {
          userImg: deleteField(),
        });
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewUsername(e.target.value);
  };

  const handleUsernameEdit = () => {
    setEditUsername(true);
  };

  const updateUserProfile = async (newUsername: string) => {
    if (user) {
      await updateProfile(user, {
        displayName: newUsername,
      });

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
    } else {
      console.error("User information is not available.");
    }
    setEditUsername(false);
  };

  const handleUsernameSave = async (
    e:
      | KeyboardEvent<HTMLTextAreaElement>
      | MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();
    if (!user || !setEditUsername) return;

    if (newUsername.length < 2) {
      alert("Please enter a username with at least 2 characters.");
      setEditUsername(false);
      return;
    }

    if (newUsername.length > 20) {
      alert("Please enter a username with at least 20 characters.");
      setEditUsername(false);
      return;
    }

    if (newUsername === user.displayName) {
      alert("Please write a name that is different from your existing name.");
      setEditUsername(false);
      return;
    }
    await updateUserProfile(newUsername);
  };

  const handleUsernameKeyDown = async (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleUsernameSave(e);
    }
  };

  return (
    user && (
      <ProfileWrapper>
        <AvartarDiv>
          <AvatarUpload htmlFor="avatar">
            {avatar ? (
              <AvartarImg src={avatar} alt="avatar" />
            ) : (
              <svg
                width={100}
                height={100}
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
            onChange={handleAvatarChange}
            id="avatar"
            type="file"
            accept="image/*"
          />
          <DeleteAvatarBtn onClick={handleAvatarDelete}>
            <IoClose aria-label="Delete" size={18} />
          </DeleteAvatarBtn>
        </AvartarDiv>
        <EditUsernameForm>
          {editUsername ? (
            <EditUsernameTextArea
              placeholder="2 ~ 20 characters"
              rows={1}
              minLength={2}
              maxLength={20}
              onChange={handleUsernameChange}
              value={newUsername}
              onKeyDown={handleUsernameKeyDown}
            />
          ) : (
            <Username>{user.displayName}</Username>
          )}
          {editUsername ? (
            <SaveUsernameIcon onClick={(e) => handleUsernameSave(e)}>
              <FaRegCheckCircle
                color="var(--success)"
                aria-label="Fininsh editing"
                size={28}
              />
            </SaveUsernameIcon>
          ) : (
            <EditUsernameIcon onClick={handleUsernameEdit}>
              <MdOutlineModeEdit aria-label="Start editing" size={22} />
            </EditUsernameIcon>
          )}
        </EditUsernameForm>
        <Posts>
          {myPosts?.map((post, index) => (
            <Post key={`${post.postId}-${index}`} {...post} />
          ))}
        </Posts>
        {isLoading && <Loader>isLoading...</Loader>}
      </ProfileWrapper>
    )
  );
};

export default Profile;
