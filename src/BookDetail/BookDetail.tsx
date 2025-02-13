import { Book } from "../types";


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


        {isTooLong && (
          <a href="#showmore">Show more...</a> 
        )}
      </p>
    </div>
  );
};

export default BookDetail;