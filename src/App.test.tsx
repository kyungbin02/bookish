import { render, screen } from '@testing-library/react';
import App from './App';

it('renders bookish', () => {
  render(<App />);
  const heading = screen.getByText(/Bookish/i);
  expect(heading).toBeInTheDocument();
});

