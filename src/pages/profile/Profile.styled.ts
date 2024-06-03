import { styled } from "styled-components";
import { FONTS } from "../../constants/fonts";
import { TextArea } from "../../common/form/Form.styled";
import { HoverButton } from "../../common/common.styled";

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
  gap: 10px;
  align-items: center;
  justify-content: center;
`;

export const Username = styled.div`
  font-size: ${FONTS.xl};
`;

export const EditUsernameTextArea = styled(TextArea)`
  padding: 10px 15px;
`;

export const EditUsernameIcon = styled(HoverButton)``;

export const SaveUsernameIcon = styled(HoverButton)``;

export const Posts = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
