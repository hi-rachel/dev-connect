import { styled } from "styled-components";
import { FONTS, FONTS_WEIGHT } from "../constants/fonts";

export const Wrapper = styled.div`
  width: 100%;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const HoverButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding: 5px;

  cursor: pointer;

  &:hover,
  &:active {
    background-color: var(--hover);
  }
`;

export const EditButton = styled.button`
  font-weight: ${FONTS_WEIGHT.medium};
  font-size: ${FONTS.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  width: 30px;
  border-radius: 50%;
  cursor: pointer;
  &:hover,
  &:active {
    background-color: var(--hover);
  }
`;

export const AttachFileInput = styled.input`
  display: none;
`;

export const Tag = styled.div`
  font-weight: ${FONTS_WEIGHT.semiBold};
  font-size: ${FONTS.sm};
  color: var(--primary);
  border-radius: 50px;
  padding: 6px 12px;
  background-color: var(--tag-background);

  @media (max-width: 480px) {
    font-size: ${FONTS.xs};
    padding: 3px 8px;
  }
`;
