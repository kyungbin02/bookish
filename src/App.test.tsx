import { render, screen } from '@testing-library/react';
import App from './App';
import { MemoryRouter as Router } from 'react-router-dom';

it('renders bookish', () => {
  render(<Router><App /></Router>);
  const heading = screen.getByText(/Bookish/i);
  expect(heading).toBeInTheDocument();
});
