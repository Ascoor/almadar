import { render, screen, fireEvent } from '@testing-library/react';
import Toolbar from '../Filters/Toolbar';
import '@testing-library/jest-dom';

test('calls onChange when region changes', () => {
  const handleChange = jest.fn();
  render(<Toolbar filters={{}} onChange={handleChange} onReset={() => {}} />);
  fireEvent.change(screen.getAllByRole('combobox')[0], { target: { value: 'TRP', name: 'region' } });
  expect(handleChange).toHaveBeenCalled();
});
