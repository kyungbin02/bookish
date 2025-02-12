import BookList from "./BookList"; 
import { useBooks } from "../useBooks"; 

const BookListContainer = () => {
    const { loading, error, books } = useBooks(); 

    return <BookList books={books} />;
}

export default BookListContainer;
