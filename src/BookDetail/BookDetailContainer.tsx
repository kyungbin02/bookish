import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { useEffect } from "react";
import { fetchBookDetails } from "../bookDetailSlice";
import BookDetail from "./BookDetail";

const BookDetailContainer = () => {
  const { id = "" } = useParams<string>();
  const { book } = useSelector((state: RootState) => ({
    book: state.detail.book,
  }));

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchBookDetails(Number(id)));
  }, [dispatch, id]);

  return <BookDetail book={book} />;
};

export default BookDetailContainer;
