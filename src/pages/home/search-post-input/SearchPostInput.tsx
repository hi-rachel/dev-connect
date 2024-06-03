import React, { ChangeEvent } from "react";
import { SearchInput } from "./SearchPostInput.styled";

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
    <SearchInput
      type="text"
      placeholder="Search..."
      onChange={handleSearchChange}
    />
  );
};

export default SearchPostInput;
