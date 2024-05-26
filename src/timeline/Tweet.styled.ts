import styled from "styled-components";
import { FONTS, FONTS_WEIGHT } from "../constants/fonts";
import { AttachFileInput, EditButton, TextArea } from "../common/common.styled";

export const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border-radius: 15px;
  height: auto;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;

  @media (prefers-color-scheme: dark) {
    box-shadow: rgba(255, 255, 255, 0.2) 0px 4px 12px;
    border: 1px solid var(--gray);
  }
`;

export const Column = styled.div``;

export const EditTextArea = styled(TextArea)`
  margin-right: 20px;
  margin-bottom: 20px;
  width: 90%;
`;

export const Photo = styled.img`
  width: 100%;
  border-radius: 15px;
`;

export const UserWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

export const Username = styled.p`
  font-weight: ${FONTS_WEIGHT.semiBold};
`;

export const UserProfilePhoto = styled.img`
  width: 36px;
  border-radius: 50%;
`;

export const UserProfileNoPhoto = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--primary);
`;

export const Payload = styled.p`
  margin: 10px 0px;
  font-size: ${FONTS.lg};
`;

export const DeleteTweetButton = styled(EditButton)`
  background-color: var(--danger);
  color: var(--foreground);
  margin-right: 15px;
`;

export const EditTweetButton = styled(EditButton)`
  background-color: var(--success);
`;

export const ChangeFileInput = styled(AttachFileInput)``;

export const ChangeFileButton = styled(EditButton)`
  border: 1px solid var(--primary);
  color: var(--primary);
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  svg {
    height: 15px;
    margin-right: 5px;
  }
`;

export const TweetDate = styled.div`
  margin-top: 15px;
`;
