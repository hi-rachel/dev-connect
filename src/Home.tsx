import { styled } from "styled-components";
import NewPostForm from "./posts/NewPostForm";
import Timeline from "./timeline/Timeline";

const Wrapper = styled.div`
  /* width: 100%; */
  /* overflow-x: hidden; */
`;

export default function Home() {
  return (
    <Wrapper>
      <NewPostForm />
      <Timeline />
    </Wrapper>
  );
}
