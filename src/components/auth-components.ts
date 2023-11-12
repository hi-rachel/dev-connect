import { styled } from "styled-components";
import { COLORS } from "../constants/color";
import { FONTS, FONTS_WEIGHT } from "../constants/font";

export const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
  padding: 50px 0px;
`;

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
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
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
  color: ${COLORS.tomato};
`;

export const Switcher = styled.span`
  margin-top: 20px;
  margin-bottom: 30px;
  a {
    color: ${COLORS.twitterBlue};
  }
`;

export const Button = styled.span`
  margin-top: 20px;
  background-color: ${COLORS.white};
  font-weight: ${FONTS_WEIGHT.medium};
  width: 100%;
  color: ${COLORS.black};
  padding: 10px 20px;
  border-radius: 50px;
  border: 0;
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
