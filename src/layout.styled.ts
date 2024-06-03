import styled from "styled-components";

export const LayoutWrapper = styled.div`
  display: grid;
  gap: 20px;
  padding: 50px 0px;
  grid-template-columns: 1fr 4fr;
  height: 100%;
  width: 100%;
  max-width: 860px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 20px 10px;
  }
`;

export const Menu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: row;
    justify-content: center;
    gap: 10px;
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
  svg {
    width: 30px;
    color: var(--foreground);
  }
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

  @media (max-width: 768px) {
    height: 40px;
    width: 40px;
    svg {
      width: 20px;
    }
  }
`;
