import React, { ChangeEvent } from "react";
import { SearchInput, SearchInputWrapper } from "./SearchPostInput.styled";
import { useTranslation } from "react-i18next";

interface SearchPostInputProps {
  setSearchKeyword: (keyword: string) => void;
}

const SearchPostInput: React.FC<SearchPostInputProps> = ({
  setSearchKeyword,
}) => {
  const { t } = useTranslation();

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  return (
    <SearchInputWrapper>
      <SearchInput
        type="text"
        placeholder={t("newPostForm.search")}
        onChange={handleSearchChange}
      />
    </SearchInputWrapper>
  );
};

export default SearchPostInput;
