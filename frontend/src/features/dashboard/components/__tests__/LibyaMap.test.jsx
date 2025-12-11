import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import LibyaMap from "../Map/LibyaMap";

test("renders Libya map placeholder message", () => {
  render(<LibyaMap />);
  expect(
    screen.getByText(/Libya map visualization is temporarily disabled./i)
  ).toBeInTheDocument();
});
