import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchBooks } from "../bookListSlice";
import SearchBox from "./SearchBox";
import BookList from "./BookList";

const BookListContainer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const books = useSelector((state: RootState) => state.list.books);

  useEffect(() => {
    dispatch(fetchBooks(""));
  }, [dispatch]);

  return (
    <>
      <SearchBox /> 
      <BookList books={books} />
    </>
  );
};

export default BookListContainer;
