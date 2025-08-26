import { render, screen } from '@testing-library/react';
import KpiCard from '../KPI/KpiCard';
import '@testing-library/jest-dom';

test('renders KPI label and value', () => {
  render(<KpiCard label="Cases" value={10} />);
  expect(screen.getByText('Cases')).toBeInTheDocument();
  expect(screen.getByText('10')).toBeInTheDocument();
});
