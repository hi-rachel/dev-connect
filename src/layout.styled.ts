import { FONTS, FONTS_WEIGHT } from "./constants/fonts";
import styled from "styled-components";

export const LayoutWrapper = styled.div`
  position: relative;
  width: 100%;
  justify-content: center;
  display: flex;
  gap: 20px;
  margin-top: 30px;
  max-width: 860px;
  min-width: 600px;
  padding-left: 100px;

  @media (max-width: 768px) {
    margin-top: 0px;
    padding-top: 80px;
    padding-bottom: 60px;
    padding-left: 0px;
  }

  @media (max-width: 480px) {
    min-width: 330px;
  }
`;

export const LayoutHeader = styled.div`
  display: none;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    z-index: 100;
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 15px 20px;
    background-color: var(--background);
    box-shadow: var(--box-shadow) 0 2px 5px;
  }
`;

export const LayoutHeaderRightDiv = styled.div`
  display: flex;
  gap: 10px;
`;

export const AvatarPopUp = styled.div`
  cursor: pointer;
  background-color: var(--background);
  position: absolute;
  top: 50px;
  right: 1px;
  box-shadow: var(--box-shadow) 0 2px 5px;
  border-radius: 15px;
  z-index: 110;
  font-weight: ${FONTS_WEIGHT.medium};
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 20px;
  max-width: 300px;

  @media (max-width: 480px) {
    font-size: ${FONTS.sm};
  }
`;

export const Menu = styled.div`
  position: fixed;
  top: 30px;
  left: 30px;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  align-items: stretch;

  @media (max-width: 768px) {
    display: none; /* 태블릿 반응형에서는 보이지 않음 */
  }
`;

export const MenuItem = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
  border-radius: 50%;

  &:hover,
  &:active {
    background-color: var(--hover);
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
  }
`;

export const ToogleTheme = styled(MenuItem)``;

export const FooterMenu = styled.div`
  display: none;
  @media (max-width: 768px) {
    z-index: 100;
    background-color: var(--background);
    display: flex;
    justify-content: space-around;
    align-items: start;
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 10px 0;
    box-shadow: var(--box-shadow) 0 -2px 5px;
  }
`;

export const FooterMenuItem = styled(MenuItem)``;
