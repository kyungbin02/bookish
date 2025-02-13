import { useEffect, useState } from "react";
import axios from "axios";
import { Book } from "./types";

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [term, setTerm] = useState<string>("");

  useEffect(() => {
    const fetchBooks = async () => {
      setError(false);
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:8080/books?q=${term}&_sort=id`);
        setBooks(res.data);
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [term]);

  return { books, term, setTerm, loading, error };
};
