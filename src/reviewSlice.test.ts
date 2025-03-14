// src/reviewSlice.test.ts

import { configureStore } from "@reduxjs/toolkit";
import axios from "axios";
import reviewSliceReducer, { updateReview } from "./reviewSlice";

jest.mock("axios");

describe("reviewSlice", () => {
  it("updates a review", async () => {
    // 1) 모의 스토어 생성
    const mockStore = configureStore({
      reducer: {
        reviews: reviewSliceReducer,
      },
    });

    // 2) 가짜 리뷰 데이터
    const review = {
      id: 1,
      bookId: 1,
      name: "Juntao",
      content: "Good work",
    };

    // 3) axios.put 모의 응답 설정
    (axios.put as jest.Mock).mockResolvedValueOnce({ data: review });

    // 4) updateReview Thunk를 dispatch
    const result = await mockStore.dispatch(
      updateReview({
        bookId: 1,
        reviewId: 1,
        content: "Good work",
      })
    );

    // 5) 결과 검증: payload가 mock된 review와 동일해야 함
    expect(result.payload).toEqual(review);
    // axios.put이 올바른 URL과 body로 호출되었는지 확인
    expect(axios.put).toHaveBeenCalledWith(
      "http://localhost:8080/books/1/reviews/1",
      { content: "Good work" }
    );
  });

  it("handles network error", async () => {
    // 1) 모의 스토어 생성
    const mockStore = configureStore({
      reducer: {
        reviews: reviewSliceReducer,
      },
    });

    // 2) 가짜 에러 생성
    const error = new Error("Network error");
    (axios.put as jest.Mock).mockRejectedValueOnce(error);

    // 3) updateReview Thunk dispatch
    const result = await mockStore.dispatch(
      updateReview({
        bookId: 1,
        reviewId: 1,
        content: "Good work",
      })
    );

    // 4) 결과 검증: rejected 액션이어야 함
    expect(result.type).toEqual("reviews/updateReview/rejected");
    expect(axios.put).toHaveBeenCalledWith(
      "http://localhost:8080/books/1/reviews/1",
      { content: "Good work" }
    );
  });
});
