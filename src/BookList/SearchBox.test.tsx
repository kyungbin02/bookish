import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import bookListReducer from "../bookListSlice";
import SearchBox from "./SearchBox";
import { act } from "react-dom/test-utils";

it("renders input", async () => {
  const mockStore = configureStore({
    reducer: {
      list: bookListReducer,
    },
  });

  render(
    <Provider store={mockStore}>
      <SearchBox />
    </Provider>
  );

  const input = screen.getByRole("textbox");

  await act(async () => {
    await userEvent.type(input, "Refactoring");
  });

  const state = mockStore.getState();
  expect(state.list.term).toEqual("Refactoring");
});

it("trim empty strings", async () => {
  const mockStore = configureStore({
    reducer: {
      list: bookListReducer,
    },
  });

  render(
    <Provider store={mockStore}>
      <SearchBox />
    </Provider>
  );

  const input = screen.getByRole("textbox");

  await act(async () => {
    await userEvent.type(input, " ");
  });

  const state = mockStore.getState();
  expect(state.list.term).toEqual("");
});
