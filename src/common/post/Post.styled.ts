import styled from "styled-components";

export const PostImg = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const DeletePostIcon = styled.div`
  border-radius: 20px;
  z-index: 100;
  background-color: var(--gray--100);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  cursor: pointer;
  opacity: 0;
`;

export const DeletePostImg = styled(PostImg)`
  position: relative;
  &:hover ${DeletePostIcon} {
    opacity: 0.6;
  }
`;
