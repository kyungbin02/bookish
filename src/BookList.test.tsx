import { screen, render } from "@testing-library/react";
import BookList from "./BookList";

describe('BookList', () => {
    it('render books', async () => {
        const props = {
            books: [
                { "id": 1, "name": "Refactoring" },
                { "id": 2, "name": "Domain-driven design" },

            ]
        };
        render(<BookList {...props} />);
                
        const headings = await screen.findAllByRole('heading')

        headings.forEach((heading, index) => {
            expect(heading).toHaveTextContent(props.books[index].name);
        });
    })
});
