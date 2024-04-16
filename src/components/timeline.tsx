import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { styled } from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";
import { Unsubscribe } from "firebase/auth";
import firebase from "firebase/compat/app";

export interface ITweet {
  id: string;
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: string;
  userImg: string;
}

const Wrapper = styled.div`
  margin-top: 50px;
  display: flex;
  gap: 10px;
  flex-direction: column;
`;

const Loader = styled.div`
  margin-top: 20px;
  text-align: center;
`;

export default function Timeline() {
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [lastVisible, setLastVisible] =
    useState<firebase.firestore.DocumentData | null>(null);
  const [showLoadMore, setShowLoadMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchTweets = () => {
      setLoading(true);
      const tweetsQuery = query(
        collection(db, "tweets"),
        orderBy("createdAt", "desc"),
        limit(20)
      );
      unsubscribe = onSnapshot(tweetsQuery, (snapshot) => {
        const newTweets: ITweet[] = [];
        snapshot.forEach((doc) => {
          const { tweet, createdAt, userId, username, photo, userImg } =
            doc.data();
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
        setTweets((prevTweets) => [...prevTweets, ...newTweets]);
        const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];
        setLastVisible(lastVisibleDoc);
        setShowLoadMore(snapshot.size >= 20);
        setLoading(false);
      });
    };

    fetchTweets();

    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (isBottom() && showLoadMore && !loading) {
        loaderRef.current?.click();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showLoadMore, loading]);

  const isBottom = () => {
    return (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight
    );
  };

  const loadMore = async () => {
    if (lastVisible) {
      setLoading(true);
      const tweetsRef = collection(db, "tweets");
      const tweetsQuery = query(
        tweetsRef,
        orderBy("createdAt", "desc"),
        startAfter(lastVisible),
        limit(20)
      );

      const snapshot = await getDocs(tweetsQuery);
      const newTweets: ITweet[] = [];
      snapshot.forEach((doc) => {
        const { tweet, createdAt, userId, username, photo, userImg } =
          doc.data();
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
      setTweets((prevTweets) => [...prevTweets, ...newTweets]);

      const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];
      setLastVisible(lastVisibleDoc);
      setShowLoadMore(snapshot.size >= 20);
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
      {loading && <Loader>Loading...</Loader>}
      {showLoadMore && (
        <button ref={loaderRef} style={{ display: "none" }} onClick={loadMore}>
          Load More
        </button>
      )}
    </Wrapper>
  );
}
