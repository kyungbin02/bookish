import { TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { setTerm, fetchBooks } from "../bookListSlice";

const SearchBox = () => {
  const dispatch = useDispatch<AppDispatch>();
  const term = useSelector((state: RootState) => state.list.term);

  const performSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value.trim().length === 0) {
      dispatch(setTerm("")); // 검색어 초기화
      return;
    }
    dispatch(setTerm(value));
    dispatch(fetchBooks(value));
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
