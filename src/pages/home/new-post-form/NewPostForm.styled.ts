import { Photo } from "../../../common/form/Form.styled";
import { DeletePostIcon } from "../../../common/post/Post.styled";
import { FONTS, FONTS_WEIGHT } from "../../../constants/fonts";
import { styled } from "styled-components";

export const Form = styled.form`
  margin: 0 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const PreviewPhoto = styled(Photo)`
  width: 50%;
`;

export const DeletePreviewIcon = styled(DeletePostIcon)`
  width: 50%;
`;

export const TagInputArea = styled.div`
  display: flex;
  gap: 10px;
  padding: 5px;
  flex-wrap: wrap;
`;

export const TagInput = styled.input`
  background: transparent;
  width: 100%;
  &:focus {
    outline: none;
  }
`;

export const MainBtn = styled.input`
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: ${FONTS.md};
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.8;
  }
`;

export const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: var(--primary);
  text-align: center;
  border-radius: 20px;
  border: 1px solid var(--primary);
  font-size: ${FONTS.sm};
  font-weight: ${FONTS_WEIGHT.semiBold};
  cursor: pointer;
`;

export const AddPhoto = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  align-items: center;
`;

export const SubmitBtn = styled(MainBtn)`
  background-color: var(--primary);
  color: var(--black);
  font-weight: ${FONTS_WEIGHT.semiBold};
  margin-bottom: 50px;

  @media (max-width: 768px) {
    font-size: ${FONTS.sm};
  }
`;
