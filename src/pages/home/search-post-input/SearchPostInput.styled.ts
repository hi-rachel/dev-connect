import styled from "styled-components";

export const SearchInput = styled.input`
  margin: 0 10px;
  background: transparent;
  width: 97%;
  padding: 0.6rem;
  margin-bottom: 1rem;
  border: 1px solid var(--primary);
  border-radius: 10px;
  font-size: 1rem;

  &:focus {
    outline: none;
  }
`;
