import { TextField } from "@mui/material";

const SearchBox = ({
  term,
  onSearch,
}: {
  term: string;
  onSearch: (term: string) => void;
}) => {
  
  const performSearch = (event: any) => {
    const value = event.target.value;
    if (value && value.trim().length === 0) {
      return; // 공백만 입력되면 검색 실행 안 함
    }
    onSearch(value);
  };

  return (
    <TextField
      label="Search"
      value={term}
      data-test="search"
      onChange={performSearch}
      margin="normal"
      variant="outlined"
    />
  );
};

export default SearchBox;
