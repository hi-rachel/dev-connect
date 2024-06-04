import styled from "styled-components";

export const PostAvatarCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary);
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 30px;
    height: 30px;
  }
`;

export const AvatarCircle = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: var(--primary);
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 30px;
    height: 30px;
  }
`;

export const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
`;
