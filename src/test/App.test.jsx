import { render, screen } from '@testing-library/react';
import Header from '../components/Header';

test('renders header title', () => {
  render(<Header />);
  const headerElement = screen.getByText(/Agent Flow Architect/i);
  expect(headerElement).toBeInTheDocument();
});
