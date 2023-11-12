import { styled } from "styled-components";
import { COLORS } from "../constants/color";
import { FONTS, FONTS_WEIGHT } from "../constants/font";

export const EditButton = styled.button`
  background-color: #0d1117;
  font-weight: ${FONTS_WEIGHT.medium};
  border: 0;
  font-size: ${FONTS.sm};
  padding: 5px 10px;
  border-radius: 5px;
  border: 1px solid #e6edf3c6;
  cursor: pointer;
  color: #e6edf3;
  &:hover,
  &:active {
    opacity: 0.8;
  }
`;

export const TextArea = styled.textarea`
  overflow: hidden;
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: ${FONTS.md};
  color: ${COLORS.white};
  background-color: ${COLORS.black};
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: ${FONTS.md};
  }
  &:focus {
    outline: none;
    border-color: ${COLORS.twitterBlue};
  }
`;

export const AttachFileInput = styled.input`
  display: none;
`;
