import { useBook } from "./useBook";

const BookDetailContainer = () => {
    const { book } = useBook();

    return (
        <div className="detail">            
            <h2 className="book-title">{book && book.name}</h2>
        </div>
    );
};

export default BookDetailContainer;
