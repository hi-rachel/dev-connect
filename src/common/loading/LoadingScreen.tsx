import { styled } from "styled-components";
import { FONTS } from "../../constants/fonts";

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Text = styled.span`
  font-size: ${FONTS.xl};
`;

const LoadingScreen = () => {
  return (
    <Wrapper>
      <Text>Loading...</Text>
    </Wrapper>
  );
};

export default LoadingScreen;
