// src/ReviewItem.tsx

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "./store";   // ★ store 경로 맞춰 import
import { updateReview } from "./reviewSlice";  // updateReview thunk
import { Review } from "./types";
import { TextField } from "@mui/material";

const ReviewItem = ({ review }: { review: Review }) => {
  // 편집 모드 여부
  const [editing, setEditing] = useState<boolean>(false);
  // 현재 표시/입력 중인 리뷰 내용 (초기값은 review.content)
  const [content, setContent] = useState<string>(review.content);

  // Redux dispatch (타이핑된 dispatch)
  const dispatch = useDispatch<AppDispatch>();

  // 편집/저장 버튼 클릭 시 로직
  const updateReviewContent = () => {
    if (editing) {
      // 편집 중이었다면, updateReview를 dispatch
      dispatch(
        updateReview({
          bookId: review.bookId,
          reviewId: review.id,
          content,
        })
      );
    }
    // 편집 모드 토글
    setEditing(!editing);
  };

  return (
    <div data-testid="review" className="review" key={review.id}>
      <div data-testid="name">{review.name}</div>

      {editing ? (
        <TextField
          name="content"
          label="content"
          margin="normal"
          variant="outlined"
          multiline
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      ) : (
        <p data-testid="review-content">{content}</p>
      )}

      <button onClick={updateReviewContent}>
        {editing ? "Submit" : "Edit"}
      </button>
    </div>
  );
};

export default ReviewItem;
