import { styled } from "styled-components";
import { COLORS } from "../constants/color";
import { FONTS } from "../constants/font";

export const EditButton = styled.button`
  background-color: ${COLORS.tomato};
  font-weight: ${FONTS.semiBold};
  border: 0;
  font-size: ${FONTS.xSmall};
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
  color: ${COLORS.white};
  &:hover,
  &:active {
    opacity: 0.8;
  }
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

export const AttachFileInput = styled.input`
  display: none;
`;
