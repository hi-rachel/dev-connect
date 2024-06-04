import styled from "styled-components";
import { FONTS, FONTS_WEIGHT } from "../../constants/fonts";
import { AttachFileInput, HoverButton } from "../common.styled";
import { TextArea } from "../form/Form.styled";

export const Posts = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 50px;
`;

export const PageTitle = styled.div`
  font-size: ${FONTS.xl};
  font-weight: ${FONTS_WEIGHT.bold};
  padding: 10px 20px;
`;

export const PostWrapper = styled.div`
  width: 100%;
  max-width: 700px;
  overflow: hidden;
  width: 100%;
  position: relative;
  padding: 20px;
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;

  @media (prefers-color-scheme: dark) {
    box-shadow: rgba(255, 255, 255, 0.2) 0px 4px 12px;
    border: 1px solid var(--gray);
  }
`;

export const NoPost = styled.div`
  display: flex;
  margin-top: 30px;
  width: 100%;
  color: var(--gray--500);
  font-size: ${FONTS.lg};
  padding: 0 20px;

  @media (prefers-color-scheme: dark) {
    color: var(--gary);
  }
`;

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
  gap: 10px;
`;

export const Username = styled.p`
  font-weight: ${FONTS_WEIGHT.semiBold};
`;

export const UserProfilePhoto = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;

  @media (max-width: 480px) {
    width: 35px;
    height: 35px;
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
  color: var(--gray--400);

  @media (max-width: 480px) {
    font-size: ${FONTS.sm};
  }

  @media (prefers-color-scheme: dark) {
    color: var(--gray--200);
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

  @media (prefers-color-scheme: dark) {
    color: var(--gray--200);
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
