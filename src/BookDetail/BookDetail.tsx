// src/BookDetail/BookDetail.tsx

import { Book } from "../types";
import ReviewList from "../ReviewList";
import ReviewForm from "./ReviewForm"; // ★ 폼을 별도 컴포넌트로 분리

const getDescriptionFor = (book: Book) => {
  return book.description ? book.description : book.name;
};

const BookDetail = ({ book }: { book: Book }) => {
  const description = getDescriptionFor(book);
  const isTooLong = description.length > 30;

  return (
    <div className="detail">
      <h2 className="book-title">{book.name}</h2>
      <p className="book-description" data-testid="book-description">
        {description}
        {isTooLong && <a href="#showmore">Show more...</a>}
      </p>

      {/* 리뷰 입력 폼: 별도 컴포넌트로 분리 */}
      <ReviewForm book={book} />

      {/* 리뷰 목록 표시 */}
      {book.reviews && <ReviewList reviews={book.reviews} />}
    </div>
  );
};

export default BookDetail;
