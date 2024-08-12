import { useEffect, useState } from "react";
import { Wrapper } from "../../common/common.styled";
import Post from "../../common/post/Post";
import { IPost } from "../../type/post";
import { Unsubscribe } from "firebase/auth";
import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import { PAGE_SIZE } from "../../constants/constants";
import { Loader } from "../../common/loading/Loading.styled";
import { NoPost, PageTitle, Posts } from "../../common/post/Post.styled";
import { useTranslation } from "react-i18next";

const BookmarkedPosts = () => {
  const { t } = useTranslation();
  const user = auth.currentUser;
  const [myPosts, setMyPosts] = useState<IPost[]>([]);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    const fetchPosts = async () => {
      setIsLoading(true);
      const postsQuery = query(
        collection(db, "posts"),
        where("bookmarkedBy", "array-contains", user?.uid),
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
    setIsLoading(true);
    const lastPost = myPosts[myPosts.length - 1];
    const postsQuery = query(
      collection(db, "posts"),
      where("bookmarkedBy", "array-contains", user?.uid),
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

  if (!user) return null;

  return (
    <Wrapper>
      <PageTitle>{t("bookmarkedLists.pageTitle")}</PageTitle>
      <Posts>
        {myPosts.length >= 1 ? (
          myPosts.map((post, index) => (
            <Post key={`${post.postId}-${index}`} {...post} />
          ))
        ) : (
          <NoPost>{t("bookmarkedLists.noPosts")}</NoPost>
        )}
      </Posts>
      {isLoading && <Loader>{t("loading")}</Loader>}
    </Wrapper>
  );
};

export default BookmarkedPosts;
