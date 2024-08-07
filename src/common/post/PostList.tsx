import { Posts } from "./Post.styled";
import Post from "./Post";
import { IPost } from "../../type/post";

interface PostListProps {
  posts: IPost[];
  setSearchKeyword: (keyword: string) => void;
  setFilterTag: (tag: string) => void;
  activeTag: string;
}

const PostList = ({
  posts,
  setSearchKeyword,
  setFilterTag,
  activeTag,
}: PostListProps) => {
  return (
    <Posts>
      {posts.map((post, index) => (
        <Post
          key={`${post.postId}-${index}`}
          {...post}
          setSearchKeyword={setSearchKeyword}
          setFilterTag={setFilterTag}
          activeTag={activeTag}
        />
      ))}
    </Posts>
  );
};

export default PostList;
