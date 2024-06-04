import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { db } from "../../../firebase";
import Post from "../../../common/post/Post";
import { Unsubscribe } from "firebase/auth";
// import HeartAnimation from "/heart-animation-2.gif";
import { IPost } from "../../../type/post";
import { PAGE_SIZE } from "../../../constants/constants";
import { Loader } from "../../../common/loading/Loading.styled";
import { Wrapper } from "../../../common/common.styled";
import { Posts } from "../../../common/post/Post.styled";

// [TODO]
// - [x] 글 검색 기능
// - [ ] 프론트, 백엔드 nav 만들기
// - [ ] tags별 검색
// - [ ] 글 post 즉시 목록 업데이트
// - [ ] toast 알림 추가
// - [ ] 반응형 작업, 스타일 일관화
// - [ ] Nav Bar 정리, 추가(내가 좋아요한 목록, 북마크 목록)
// - [ ] SEO 개선, meta 태그 추가
// - [ ] 도메인 설정, 모바일 도메인 접근 풀기
// UI Library

interface TimelineProps {
  searchKeyword: string;
}

export default function Timeline({ searchKeyword }: TimelineProps) {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  // const [showHeartAnimation, setShowHeartAnimation] = useState(false);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    const fetchPosts = async () => {
      setIsLoading(true);
      const postsQuery = query(
        collection(db, "posts"),
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
        setPosts([...newPosts]); // 기존 트윗 목록에 새로운 트윗 추가
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
      isLoading === false &&
      hasMoreData === true
    ) {
      // 페이지 끝에 도달하면 추가 데이터를 받아온다
      fetchNextPosts();
    }
  };

  const fetchNextPosts = async () => {
    setIsLoading(true);
    const lastPost = posts[posts.length - 1];
    const postsQuery = query(
      collection(db, "posts"),
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
    setPosts((prevPosts) => [...prevPosts, ...newPosts]);
    setIsLoading(false);
    if (snapshot.size < PAGE_SIZE) {
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

  //   const handleClickHeart = (like: boolean) => {
  //     if (like) {
  //       setShowHeartAnimation(true);
  //       setTimeout(() => {
  //         setShowHeartAnimation(false);
  //       }, 1000);
  //     }
  //   };

  // const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchKeyword(e.target.value);
  // };

  const filteredPosts = posts.filter((post) => {
    const filteredTags = post.tags.filter((tag: string) =>
      tag.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    const filteredContent = post.content
      .toLowerCase()
      .includes(searchKeyword.toLowerCase());
    const filteredUserName = post.userName
      .toLowerCase()
      .includes(searchKeyword.toLowerCase());
    return filteredTags.length > 0 || filteredContent || filteredUserName;
  });

  return (
    <Wrapper>
      {/* <HeartBounce>
        {showHeartAnimation && (
          <img
            src={HeartAnimation}
            alt="heart-animation"
            className="heart-animation"
          />
        )}
      </HeartBounce> */}
      <Posts>
        {searchKeyword
          ? filteredPosts.map((post, index) => (
              <Post key={`${post.postId}-${index}`} {...post} />
            ))
          : posts.map((post, index) => (
              <Post key={`${post.postId}-${index}`} {...post} />
            ))}
      </Posts>
      {isLoading && <Loader>isLoading...</Loader>}
    </Wrapper>
  );
}
