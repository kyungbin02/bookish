import { Book } from "./types";

const BookList = ({ books }: { books: Book[] }) => {
  console.log("Books array:", books); // 전체 books 데이터를 확인

  return (
    <div data-test="book-list">
      {books.map((book, index) => {
        console.log("Book ID:", book.id); // 각 book의 ID 확인
        return (
          <div className="book-item" key={book.id || index}> {/* id가 없으면 index 사용 */}
            <h2 className="title">{book.name}</h2>
            <a href={`/books/${book.id}`}>View Details</a>
          </div>
        );
      })}
    </div>
  );
};

export default BookList;
