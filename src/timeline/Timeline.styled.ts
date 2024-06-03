import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  margin-top: 50px;
  display: flex;
  gap: 10px;
  flex-direction: column;
`;

export const Loader = styled.div`
  padding: 20px;
  text-align: center;
`;

export const HeartBounce = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  pointer-events: none; /* Ensures the animation doesn't interfere with other elements */
`;
