import { styled } from "styled-components";
import NewPostForm from "./new-post-form/NewPostForm";
import Timeline from "./timeline/Timeline";
import { useState } from "react";
import SearchPostInput from "./search-post-input/SearchPostInput";
import { FONTS, FONTS_WEIGHT } from "../../constants/fonts";
import HomeFooter from "../../common/footer/HomeFooter";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-top: 10px;
`;

const LogoTitle = styled.div`
  font-size: ${FONTS.logo};
  font-weight: ${FONTS_WEIGHT.bold};
  padding: 0 10px;
  margin-bottom: 10px;
  font-family: "Dancing Script", cursive;
  font-style: normal;
`;

export default function Home() {
  const [searchKeyword, setSearchKeyword] = useState("");

  return (
    <Wrapper>
      <LogoTitle>Dev Connect</LogoTitle>
      <SearchPostInput setSearchKeyword={setSearchKeyword} />
      <NewPostForm />
      <Timeline searchKeyword={searchKeyword} />
      <HomeFooter />
    </Wrapper>
  );
}
