import { styled } from "styled-components";
import { FONTS, FONTS_WEIGHT } from "../constants/fonts";

export const EditButton = styled.button`
  font-weight: ${FONTS_WEIGHT.medium};
  font-size: ${FONTS.sm};
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.8;
  }
`;

export const TextArea = styled.textarea`
  background: transparent;
  overflow: hidden;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  padding: 20px;
  border-radius: 20px;
  font-size: ${FONTS.md};
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: ${FONTS.md};
  }
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
  @media (prefers-color-scheme: dark) {
    box-shadow: rgba(255, 255, 255, 0.2) 0px 4px 12px;
    border: 1px solid var(--gray);
  }
`;

export const AttachFileInput = styled.input`
  display: none;
`;
