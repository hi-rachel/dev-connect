import React, { ChangeEvent } from "react";
import { SearchInput, SearchInputWrapper } from "./SearchPostInput.styled";

interface SearchPostInputProps {
  setSearchKeyword: (keyword: string) => void;
}

const SearchPostInput: React.FC<SearchPostInputProps> = ({
  setSearchKeyword,
}) => {
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  return (
    <SearchInputWrapper>
      <SearchInput
        type="text"
        placeholder="Search..."
        onChange={handleSearchChange}
      />
    </SearchInputWrapper>
  );
};

export default SearchPostInput;
