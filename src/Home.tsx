import { styled } from "styled-components";
import PostTweetForm from "./timeline/PostTweetForm";
import Timeline from "./timeline/Timeline";

const Wrapper = styled.div``;

export default function Home() {
  return (
    <Wrapper>
      <PostTweetForm />
      <Timeline />
    </Wrapper>
  );
}
