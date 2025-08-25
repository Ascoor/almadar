import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('react-simple-maps', () => ({
  ComposableMap: ({ children }) => <svg>{children}</svg>,
  Geographies: ({ children }) => <g>{children({ geographies: [] })}</g>,
  Geography: () => <g />,
}));

jest.mock('@/assets/geo/libya.json', () => ({ default: { features: [] } }));

import LibyaMap from '../Map/LibyaMap';

test('renders SVG map', () => {
  const { container } = render(<LibyaMap data={[]} />);
  expect(container.querySelector('svg')).toBeInTheDocument();
});
