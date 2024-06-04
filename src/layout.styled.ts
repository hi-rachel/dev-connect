import { FONTS, FONTS_WEIGHT } from "./constants/fonts";
import styled from "styled-components";

export const LayoutWrapper = styled.div`
  width: 100%;
  justify-content: center;
  display: flex;
  gap: 20px;
  padding: 50px 0px;
  max-width: 860px;
  position: relative;
  padding-top: 80px;
  padding-bottom: 60px;
`;

export const LayoutHeader = styled.div`
  display: none;

  @media (max-width: 480px) {
    position: fixed;
    top: 0;
    z-index: 100;
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 15px 30px;
    background-color: var(--background);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  @media (prefers-color-scheme: dark) {
    box-shadow: rgba(255, 255, 255, 0.2) 0px 0px 3px 3px;
  }
`;

export const AvatarPopUp = styled.div`
  cursor: pointer;
  background-color: var(--background);
  position: absolute;
  top: 50px;
  right: 1px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  z-index: 110;
  font-weight: ${FONTS_WEIGHT.medium};
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 20px;
  max-width: 300px;

  @media (prefers-color-scheme: dark) {
    box-shadow: rgba(255, 255, 255, 0.2) 0px 2px 2px 2px;
  }

  @media (max-width: 480px) {
    font-size: ${FONTS.sm};
  }
`;

export const Menu = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  @media (max-width: 480px) {
    display: none;
  }
`;

export const MenuItem = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 50px;
  border-radius: 50%;

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

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
  }
`;

export const FooterMenu = styled.div`
  display: none;
  @media (max-width: 480px) {
    z-index: 100;
    background-color: var(--background);
    display: flex;
    justify-content: space-around;
    align-items: start;
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 10px 0;
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  }

  @media (prefers-color-scheme: dark) {
    box-shadow: rgba(255, 255, 255, 0.2) 0 3px 3px 5px;
  }
`;

export const FooterMenuItem = styled(MenuItem)``;
