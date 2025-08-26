import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('react-simple-maps', () => ({
  ComposableMap: ({ children }) => <svg>{children}</svg>,
  Geographies: ({ children }) => (
    <g>
      {children({ geographies: [{ rsmKey: 'TRP', id: 'TRP', properties: { id: 'TRP' } }] })}
    </g>
  ),
  Geography: ({ geography, fill }) => <path data-id={geography.properties.id} fill={fill} />,
}));

import LibyaMapPro from '../Map/LibyaMapPro';

test('renders SVG map and applies fill', () => {
  const { container } = render(
    <LibyaMapPro data={[{ regionCode: 'TRP', count: 5 }]} />
  );
  expect(container.querySelector('svg')).toBeInTheDocument();
  const path = container.querySelector('path[data-id="TRP"]');
  expect(path).toBeInTheDocument();
  expect(path).toHaveAttribute('fill');
});
