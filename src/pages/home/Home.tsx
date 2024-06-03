import { styled } from "styled-components";
import NewPostForm from "./new-post-form/NewPostForm";
import Timeline from "./timeline/Timeline";
import { useState } from "react";
import SearchPostInput from "./search-post-input/SearchPostInput";

const Wrapper = styled.div``;

export default function Home() {
  const [searchKeyword, setSearchKeyword] = useState("");

  return (
    <Wrapper>
      <SearchPostInput setSearchKeyword={setSearchKeyword} />
      <NewPostForm />
      <Timeline searchKeyword={searchKeyword} />
    </Wrapper>
  );
}
