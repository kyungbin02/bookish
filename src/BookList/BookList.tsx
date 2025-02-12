import { Book } from "../types";

const BookList = ({ books }: { books: Book[] }) => {
  console.log("Books array:", books); 

  return (
    <div data-test="book-list">
      {books.map((book, index) => {
        console.log("Book ID:", book.id); 
        return (
          <div className="book-item" key={book.id || index}>
            <h2 className="title">{book.name}</h2>
            <a href={`/books/${book.id}`}>View Details</a>
          </div>
        );
      })}
    </div>
  );
};

export default BookList;
