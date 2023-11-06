import { styled } from "styled-components";
import { COLORS } from "../constants/color";
import { FONTS } from "../constants/font";

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: ${FONTS.normal};
  color: ${COLORS.white};
  background-color: ${COLORS.black};
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: ${FONTS.normal};
  }
  &:focus {
    outline: none;
    border-color: ${COLORS.twitterBlue};
  }
`;

export const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: ${COLORS.twitterBlue};
  text-align: center;
  border-radius: 20px;
  border: 1px solid ${COLORS.twitterBlue};
  font-size: ${FONTS.small};
  font-weight: ${FONTS.semiBold};
  cursor: pointer;
`;

export const AttachFileInput = styled.input`
  display: none;
`;

// [ ]make reusable btn
export const SubmitBtn = styled.input`
  background-color: ${COLORS.twitterBlue};
  color: ${COLORS.white};
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: ${FONTS.normal};
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.8;
  }
`;
