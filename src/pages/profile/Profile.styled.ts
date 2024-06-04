import { styled } from "styled-components";
import { FONTS } from "../../constants/fonts";
import { TextArea } from "../../common/form/Form.styled";
import { HoverButton, Wrapper } from "../../common/common.styled";

export const ProfileWrapper = styled(Wrapper)`
  align-items: center;
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

export const EditUsernameForm = styled.form`
  width: 100%;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
`;

export const Username = styled.div`
  font-size: ${FONTS.lg};
`;

export const EditUsernameTextArea = styled(TextArea)`
  overflow: hidden;
  width: 45%;
  padding: 10px 15px;
  font-size: ${FONTS.lg};
  min-width: 320px;

  @media (max-width: 480px) {
    width: 80%;
  }
`;

export const EditUsernameIcon = styled(HoverButton)``;

export const SaveUsernameIcon = styled(HoverButton)``;
