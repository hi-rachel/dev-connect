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
import Tweet from "./Tweet";
import { Unsubscribe } from "firebase/auth";

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
  padding: 20px;
  text-align: center;
`;

export default function Timeline() {
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const pageSize = 10;

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    const fetchTweets = async () => {
      setIsLoading(true);
      const tweetsQuery = query(
        collection(db, "tweets"),
        orderBy("createdAt", "desc"),
        limit(pageSize)
      );
      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
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
        setTweets((prevTweets) => [...prevTweets, ...newTweets]); // 기존 트윗 목록에 새로운 트윗 추가
        setIsLoading(false);
      });
    };

    fetchTweets();

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
      isLoading === false &&
      hasMoreData === true
    ) {
      // 페이지 끝에 도달하면 추가 데이터를 받아온다
      fetchNextTweets();
    }
  };

  const fetchNextTweets = async () => {
    console.log(tweets);
    setIsLoading(true);
    const lastTweet = tweets[tweets.length - 1];
    const tweetsQuery = query(
      collection(db, "tweets"),
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
    setTweets((prevTweets) => [...prevTweets, ...newTweets]);
    console.log(tweets);
    setIsLoading(false);
    if (snapshot.size < pageSize) {
      // 페이지 당 데이터 크기보다 적게 받아왔으면 추가 데이터 없음을 표시
      setHasMoreData(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  return (
    <Wrapper>
      {tweets.map((tweet, index) => (
        <Tweet key={`${tweet.id}-${index}`} {...tweet} />
      ))}
      {isLoading && <Loader>isLoading...</Loader>}
    </Wrapper>
  );
}
