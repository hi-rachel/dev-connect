import styled from "styled-components";
import { FONTS, FONTS_WEIGHT } from "../constants/fonts";
import { AttachFileInput, EditButton, TextArea } from "../common/common.styled";

export const PostWrapper = styled.div`
  padding: 20px;
  border-radius: 15px;
  height: auto;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;

  @media (prefers-color-scheme: dark) {
    box-shadow: rgba(255, 255, 255, 0.2) 0px 4px 12px;
    border: 1px solid var(--gray);
  }
`;

export const PostGrid = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
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

export const DeletePostButton = styled(EditButton)`
  background-color: var(--danger);
  color: var(--foreground);
  margin-right: 15px;
`;

export const EditPostButton = styled(EditButton)`
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

export const PostDate = styled.div`
  margin: 15px 0;
`;

export const TagWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const Tag = styled.div`
  padding: 4px 8px;
  border-radius: 16px;
  background-color: #f3f4f6;
`;

export const PostFooter = styled.div`
  width: 100%;
  display: flex;
  gap: 10px;
  align-items: center;
`;

export const LikesCount = styled.div`
  color: var(--gray);
`;
