import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { useEffect, useState } from "react";
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

export default function Timeline() {
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [lastVisible, setLastVisible] =
    useState<firebase.firestore.DocumentData | null>(null);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchTweets = () => {
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
        setTweets(newTweets);
        const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];
        setLastVisible(lastVisibleDoc);
      });
    };

    fetchTweets();

    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  const loadMore = async () => {
    if (lastVisible) {
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
    }
  };

  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
      <button onClick={loadMore}>Load More</button>
    </Wrapper>
  );
}
