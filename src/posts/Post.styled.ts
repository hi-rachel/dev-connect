import styled from "styled-components";
import { FONTS, FONTS_WEIGHT } from "./../constants/fonts";
import { AttachFileInput, HoverButton } from "../common/common.styled";
import { TextArea } from "../common/form/Form.styled";

export const PostWrapper = styled.div`
  max-width: 700px;
  overflow: hidden;
  width: 100%;
  position: relative;
  padding: 20px;
  border-radius: 15px;
  height: auto;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  margin: 10px auto;

  @media (prefers-color-scheme: dark) {
    box-shadow: rgba(255, 255, 255, 0.2) 0px 4px 12px;
    border: 1px solid var(--gray);
  }

  @media (max-width: 768px) {
    max-width: 680px;
  }

  @media (max-width: 480px) {
    max-width: 360px;
  }
`;

export const PostContents = styled.div`
  padding: 10px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;

  @media (max-width: 480px) {
    padding: 10px 20px;
  }
`;

export const EditTextArea = styled(TextArea)`
  margin-right: 20px;
  margin-bottom: 20px;
  width: 100%;
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

  @media (max-width: 768px) {
    width: 30px;
  }

  @media (max-width: 480px) {
    width: 25px;
  }
`;

export const UserProfileNoPhoto = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--primary);

  @media (max-width: 768px) {
    width: 30px;
    height: 30px;
  }

  @media (max-width: 480px) {
    width: 25px;
    height: 25px;
  }
`;

export const Payload = styled.p`
  word-wrap: break-word;
  margin-bottom: 15px;
  font-size: ${FONTS.lg};

  @media (max-width: 768px) {
    font-size: ${FONTS.md};
  }

  @media (max-width: 480px) {
    font-size: ${FONTS.sm};
  }
`;

export const PostControls = styled.div`
  display: flex;
  gap: 5px;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 0px;
  top: 20px;
`;

export const DeletePostButton = styled(HoverButton)`
  margin-right: 15px;
  &:hover,
  &:active {
    background-color: rgba(255, 79, 84, 0.5);
  }
`;

export const EditPostButton = styled(HoverButton)``;

export const ChangeFileInput = styled(AttachFileInput)``;

export const ChangeFileButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  border-radius: 50%;
  cursor: pointer;
  &:hover,
  &:active {
    background-color: var(--gray-100);
  }
  @media (prefers-color-scheme: dark) {
    &:hover,
    &:active {
      background-color: var(--gray);
    }
  }
`;

export const PostDate = styled.div`
  color: var(--gray);

  @media (max-width: 480px) {
    font-size: ${FONTS.sm};
  }
`;

export const TagWrapper = styled.div`
  font-size: ${FONTS.sm};
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
`;

export const PostFooter = styled.div`
  margin-top: 10px;
  color: var(--gray);
  display: flex;
  flex-direction: column;

  @media (max-width: 480px) {
    font-size: ${FONTS.sm};
  }
`;

export const FooterControls = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 15px;
  align-items: center;

  @media (max-width: 768px) {
    gap: 10px;
  }
`;

export const LikesCount = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;
