import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBox from "./SearchBox";

describe("SearchBox", () => {
  it("renders input", async () => {
    const props = {
      term: "",
      onSearch: jest.fn(),
    };

    render(<SearchBox {...props} />);
    const input = screen.getByRole("textbox");

    await userEvent.type(input, "Refactoring");
    expect(props.onSearch).toHaveBeenCalled();
  });

  it("trim empty strings", async () => {
    const props = {
      term: "",
      onSearch: jest.fn(),
    };

    render(<SearchBox {...props} />);
    const input = screen.getByRole("textbox");

    await userEvent.type(input, " ");
    expect(props.onSearch).not.toHaveBeenCalled();
  });
});