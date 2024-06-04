import { styled } from "styled-components";
import { FONTS, FONTS_WEIGHT } from "../constants/fonts";

export const Title = styled.h1`
  font-size: ${FONTS.title};
`;

export const Form = styled.form`
  margin-top: 50px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

export const Input = styled.input`
  color: var(--background);
  border: 1px solid var(--gray--300);
  font-weight: ${FONTS_WEIGHT.medium};
  padding: 10px 20px;
  border-radius: 50px;
  width: 100%;
  font-size: ${FONTS.md};
  &[type="submit"] {
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
`;

export const Error = styled.span`
  font-weight: ${FONTS_WEIGHT.semiBold};
  color: var(--danger);
`;

export const Switcher = styled.div`
  text-align: center;
  margin-top: 20px;
  margin-bottom: 30px;
  a {
    color: var(--primary);
  }
`;

export const Button = styled.button`
  background: transparent;
  margin-top: 20px;
  font-weight: ${FONTS_WEIGHT.medium};
  width: 100%;
  padding: 10px 20px;
  border-radius: 50px;
  border: 1px solid var(--gray--300);
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

export const Logo = styled.img`
  height: 25px;
`;
