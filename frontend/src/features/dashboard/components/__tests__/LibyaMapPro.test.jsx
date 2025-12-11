import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import LibyaMapPro from "../Map/LibyaMapPro";

test("renders Libya pro map placeholder message", () => {
  render(<LibyaMapPro />);
  expect(
    screen.getByText(/Advanced Libya map is temporarily disabled./i)
  ).toBeInTheDocument();
});
