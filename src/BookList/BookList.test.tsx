import { MemoryRouter as Router } from "react-router-dom";
import { screen, render } from "@testing-library/react";
import BookList from "../BookList/BookList";

const renderWithRouter = (component: JSX.Element) => {
    return render(<Router>{component}</Router>);
};

describe('BookList', () => {
    it('render books', async () => {
        const props = {
            books: [
                { "id": 1, "name": "Refactoring" },
                { "id": 2, "name": "Domain-driven design" },
            ]
        };

        renderWithRouter(<BookList {...props} />);
                
        const headings = await screen.findAllByRole('heading');

        headings.forEach((heading, index) => {
            expect(heading).toHaveTextContent(props.books[index].name);
        });
    });
});
