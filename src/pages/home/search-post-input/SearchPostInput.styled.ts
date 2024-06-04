import styled from "styled-components";

export const SearchInputWrapper = styled.div`
  width: 100%;
  padding: 0 20px;
`;

export const SearchInput = styled.input`
  background: transparent;
  width: 100%;
  padding: 0.6rem;
  margin-bottom: 1rem;
  border: 1px solid var(--primary);
  border-radius: 10px;
  font-size: 1rem;

  &:focus {
    outline: none;
  }
`;
