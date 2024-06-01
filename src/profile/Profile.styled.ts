import { styled } from "styled-components";
import { FONTS } from "../constants/fonts";
import { TextArea } from "../common/common.styled";

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;

export const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: var(--primary);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;

export const AvartarImg = styled.img`
  width: 100%;
  height: 100%;
`;

export const AvartarInput = styled.input`
  display: none;
`;

export const UsernameSpace = styled.form`
  display: flex;
  align-items: center;
`;

export const Username = styled.div`
  font-size: ${FONTS.xl};
`;

export const EditUsernameTextArea = styled(TextArea)`
  width: fit-content;
  padding: 5px;
`;

export const EditUsernameIcon = styled.div`
  width: 22px;
  height: 22px;
  margin-right: 8px;
`;

export const SaveUsernameIcon = styled(EditUsernameIcon)`
  width: 32px;
  height: 32px;
`;

export const Posts = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Loader = styled.div`
  padding: 20px;
  text-align: center;
`;
