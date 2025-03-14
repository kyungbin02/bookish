// src/reviewSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Review } from "./types";

/** 새 리뷰 추가 요청 파라미터 */
type AddReviewRequest = {
  id: number;        // bookId
  name: string;
  content: string;
};

/** 기존 리뷰 수정 요청 파라미터 */
type UpdateReviewRequest = {
  bookId: number;    // 책 ID
  reviewId: number;  // 수정할 리뷰 ID
  content: string;   // 수정할 내용
};

// 1) 새 리뷰 추가
export const addReview = createAsyncThunk<Review, AddReviewRequest>(
  "reviews/addReview",
  async ({ id, name, content }) => {
    const response = await axios.post(
      `http://localhost:8080/books/${id}/reviews`,
      { name, content }
    );
    return response.data; // 서버가 반환한 리뷰 객체
  }
);

// 2) 리뷰 수정
export const updateReview = createAsyncThunk<Review, UpdateReviewRequest>(
  "reviews/updateReview",
  async ({ bookId, reviewId, content }) => {
    const response = await axios.put(
      `http://localhost:8080/books/${bookId}/reviews/${reviewId}`,
      { content }
    );
    return response.data; // 서버가 반환한 수정된 리뷰 객체
  }
);

// 리듀서 상태 타입
interface ReviewState {
  items: Review[];
}

const initialState: ReviewState = {
  items: [],
};

// createSlice를 사용하여 리듀서 생성
const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // addReview.fulfilled 시, 새 리뷰를 items 배열에 추가
    builder.addCase(addReview.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });
    // updateReview.fulfilled 시, 기존 리뷰를 찾아 업데이트
    builder.addCase(updateReview.fulfilled, (state, action) => {
      const updatedReview = action.payload;
      const index = state.items.findIndex((r) => r.id === updatedReview.id);
      if (index >= 0) {
        state.items[index] = updatedReview;
      }
    });
  },
});

export default reviewSlice.reducer;
