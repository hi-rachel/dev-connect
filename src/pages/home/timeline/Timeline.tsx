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
import { Unsubscribe } from "firebase/auth";
import { IPost } from "../../../type/post";
import { PAGE_SIZE } from "../../../constants/constants";
import { Loader } from "../../../common/loading/Loading.styled";
import { Wrapper } from "../../../common/common.styled";
import PostList from "../../../common/post/PostList";

// [TODO]
// - [x] 글 검색 기능
// - [ ] 프론트, 백엔드 nav 만들기
// - [x] tags별 검색
// - [x] 글 post 즉시 목록 업데이트
// - [ ] toast 알림 추가
// - [x] 반응형 작업
// - [x] Nav Bar 정리, 추가(내가 좋아요한 목록, 북마크 목록)
// - [ ] 아이콘 개선
// - [ ] SEO 개선, meta 태그 추가
// - [ ] 도메인 설정, 모바일 도메인 접근 풀기
// UI Library

interface TimelineProps {
  searchKeyword: string;
  setSearchKeyword: (keyword: string) => void;
  filterTag: string;
  setFilterTag: (tag: string) => void;
}

const Timeline = ({
  searchKeyword,
  setSearchKeyword,
  filterTag,
  setFilterTag,
}: TimelineProps) => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [activeTag, setActiveTag] = useState("");

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
        setPosts([...newPosts]);
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
      setHasMoreData(false);
    }
  };

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    if (
      scrollTop + clientHeight + 100 >= scrollHeight &&
      isLoading === false &&
      hasMoreData === true
    ) {
      fetchNextPosts();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  const filteredPosts = posts.filter((post) => {
    const matchesTag = filterTag
      ? post.tags.some((tag: string) =>
          tag.toLowerCase().includes(filterTag.toLowerCase())
        )
      : true;
    const matchesKeyword = searchKeyword
      ? post.content.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        post.userName.toLowerCase().includes(searchKeyword.toLowerCase())
      : true;
    return matchesTag && matchesKeyword;
  });

  const handleTagClick = (tag: string) => {
    setFilterTag(tag);
    setActiveTag(tag);
  };

  useEffect(() => {
    if (!filterTag) {
      setActiveTag("");
    }
  }, [filterTag]);

  return (
    <Wrapper>
      <PostList
        posts={filteredPosts}
        setSearchKeyword={setSearchKeyword}
        setFilterTag={handleTagClick}
        activeTag={activeTag}
      />
      {isLoading && <Loader>isLoading...</Loader>}
    </Wrapper>
  );
};

export default Timeline;
