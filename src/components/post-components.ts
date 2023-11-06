import { styled } from "styled-components";
import { COLORS } from "../constants/color";
import { FONTS } from "../constants/font";

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const MainBtn = styled.input`
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: ${FONTS.normal};
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.8;
  }
`;

export const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: ${COLORS.twitterBlue};
  text-align: center;
  border-radius: 20px;
  border: 1px solid ${COLORS.twitterBlue};
  font-size: ${FONTS.small};
  font-weight: ${FONTS.semiBold};
  cursor: pointer;
`;

export const SubmitBtn = styled(MainBtn)`
  background-color: ${COLORS.twitterBlue};
  color: ${COLORS.white};
`;
