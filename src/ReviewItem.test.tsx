// src/ReviewItem.test.tsx

import React from "react";
import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import ReviewItem from "./ReviewItem";
import reviewSliceReducer from "./reviewSlice";

// 유틸 함수: Redux Provider로 감싸 렌더
const renderWithProvider = (ui: React.ReactElement) => {
  const store = configureStore({
    reducer: { reviews: reviewSliceReducer },
  });
  return render(<Provider store={store}>{ui}</Provider>);
};

describe("ReviewItem", () => {
  it("renders book review detailed information", () => {
    const review = {
      id: 1,
      bookId: 1,
      name: "Juntao Qiu",
      date: "2023/06/21",
      content: "Excellent work, really impressed by your efforts",
    };

    // 기존: render(<ReviewItem review={review} />);
    // 수정: renderWithProvider
    renderWithProvider(<ReviewItem review={review} />);

    expect(screen.getByTestId("name")).toHaveTextContent("Juntao Qiu");
    expect(screen.getByTestId("review-content")).toHaveTextContent(
      "Excellent work, really impressed by your efforts"
    );
  });

  it("edit a review item", () => {
    const review = {
      id: 1,
      bookId: 1,
      name: "Juntao Qiu",
      date: "2023/06/21",
      content: "Excellent work, really impressed by your efforts",
    };

    renderWithProvider(<ReviewItem review={review} />);
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Edit");

    act(() => {
      userEvent.click(button);
    });

    expect(button).toHaveTextContent("Submit");
  });

  it("copy content to a textarea for editing", () => {
    const review = {
      id: 1,
      bookId: 1,
      name: "Juntao Qiu",
      date: "2023/06/21",
      content: "Excellent work, really impressed by your efforts",
    };

    renderWithProvider(<ReviewItem review={review} />);
    const button = screen.getByRole("button");
    const contentElement = screen.getByTestId("review-content");
    expect(contentElement).toBeInTheDocument();

    act(() => {
      userEvent.click(button);
    });

    // 편집 모드에서 <TextField>가 role="textbox"가 됩니다
    const editingContent = screen.getByRole("textbox");
    // 기존 review-content는 사라져야 합니다
    expect(() => screen.getByTestId("review-content")).toThrow();
    expect(editingContent).toBeInTheDocument();
    expect(editingContent).toHaveValue(
      "Excellent work, really impressed by your efforts"
    );
  });

  it("update the content", () => {
    const review = {
      id: 1,
      bookId: 1,
      name: "Juntao Qiu",
      date: "2023/06/21",
      content: "Excellent work, really impressed by your efforts",
    };

    renderWithProvider(<ReviewItem review={review} />);

    // axios.put 모킹
    const putSpy = jest.spyOn(axios, "put").mockResolvedValue({
      data: { ...review, content: "I mean this is fantastic" },
    });

    const button = screen.getByRole("button");

    // 편집 모드
    act(() => {
      userEvent.click(button);
    });

    const editingContent = screen.getByRole("textbox");
    expect(editingContent).toBeInTheDocument();

    act(() => {
      userEvent.clear(editingContent);
      userEvent.type(editingContent, "I mean this is fantastic");
    });

    // Submit
    act(() => {
      userEvent.click(button);
    });

    expect(putSpy).toHaveBeenCalledWith(
      "http://localhost:8080/books/1/reviews/1",
      { content: "I mean this is fantastic" }
    );
  });
});
