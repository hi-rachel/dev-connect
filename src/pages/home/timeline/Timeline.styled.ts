import styled from "styled-components";

export const HeartBounce = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  pointer-events: none; /* Ensures the animation doesn't interfere with other elements */
`;
