import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux"; // ✅ 추가
import store from "../store";           // ✅ 추가
import BookDetail from "../BookDetail/BookDetail";

// ✅ 공통 Provider 감싸는 함수 추가
const renderWithProvider = (component: JSX.Element) => {
  return render(<Provider store={store}>{component}</Provider>);
};

describe("BookDetail", () => {
  it("renders title", () => {
    const props = {
      book: {
        id: 1,
        name: "Refactoring",
      },
    };
    renderWithProvider(<BookDetail {...props} />);
    const title = screen.getByRole("heading");
    expect(title.innerHTML).toEqual(props.book.name);
  });

  it("renders description", () => {
    const props = {
      book: {
        id: 1,
        name: "Refactoring",
        description:
          "Martin Fowler's Refactoring defined core ideas and techniques " +
          "that hundreds of thousands of developers have used to improve " +
          "their software.",
      },
    };
    renderWithProvider(<BookDetail {...props} />);
    const description = screen.getByText(props.book.description);
    expect(description).toBeInTheDocument();
  });

  it("displays the book name when no description was given", () => {
    const props = {
      book: {
        id: 1,
        name: "Refactoring",
      },
    };
    renderWithProvider(<BookDetail {...props} />);
    const description = screen.getByTestId("book-description");
    expect(description).toHaveTextContent(props.book.name);
  });

  it("Shows *more* link when description is too long", () => {
    const props = {
      book: {
        id: 1,
        name: "Refactoring",
        description: "The book about how to do refactoring ....",
      },
    };
    renderWithProvider(<BookDetail {...props} />);
    const link = screen.getByText("Show more...");
    expect(link).toBeInTheDocument();
    const description = screen.getByTestId("book-description");
    expect(description).toHaveTextContent("The book about how to do refactoring ....");
  });

  it("renders reviews", () => {
    const props = {
      book: {
        id: 1,
        name: "Refactoring",
        description: "Martin Fowler's Refactoring defined core ideas and techniques...",
        reviews: [
          {
            id: 1,
            bookId: 1,
            name: "Juntao",
            date: "2023/06/21",
            content: "Excellent work, really impressed by your efforts",
          },
        ],
      },
    };
    renderWithProvider(<BookDetail {...props} />);

    // 'review' 요소가 1개 있어야 함
    const reviews = screen.getAllByTestId("review");
    expect(reviews.length).toBe(1);

    // [업데이트된 부분]
    // review 요소 안에 'Juntao'와 'Excellent work...'가 둘 다 포함되어 있는지 검사
    expect(reviews[0]).toHaveTextContent("Juntao");
    expect(reviews[0]).toHaveTextContent("Excellent work, really impressed by your efforts");
  });

  it("renders review form", () => {
    const props = {
      book: {
        id: 1,
        name: "Refactoring",
        description: "Martin Fowler's Refactoring defined core ideas and techniques...",
      },
    };
    renderWithProvider(<BookDetail {...props} />);
    const nameInput = screen.getByTestId("name");
    const contentInput = screen.getByTestId("content");
    const button = screen.getByTestId("submit");
    expect(nameInput).toBeInTheDocument();
    expect(contentInput).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });
});
