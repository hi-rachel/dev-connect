import { styled } from "styled-components";
import NewPostForm from "./posts/NewPostForm";
import Timeline from "./timeline/Timeline";

const Wrapper = styled.div``;

export default function Home() {
  return (
    <Wrapper>
      <NewPostForm />
      <Timeline />
    </Wrapper>
  );
}
