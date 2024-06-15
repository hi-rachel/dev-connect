import styled from "styled-components";
import { FONTS } from "../../constants/fonts";

export const Photo = styled.img`
  border-radius: 20px;
  max-width: 100%;
  height: auto;
`;

export const TextArea = styled.textarea`
  background: transparent;
  overflow: auto; /* Ensure scrollbar is always visible */
  box-shadow: var(--box-shadow) 0px 4px 12px;
  padding: 20px;
  border-radius: 20px;
  font-size: ${FONTS.md};
  width: 100%;
  resize: none;
  &::placeholder {
    font-size: ${FONTS.md};
  }
  &:focus {
    outline: none;
  }

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--primary); /* Color of the scrollbar */
    border-radius: 20px; /* Radius of the scrollbar thumb */
  }

  &::-webkit-scrollbar-track {
    background-color: transparent; /* Color of the scrollbar track */
  }
`;
