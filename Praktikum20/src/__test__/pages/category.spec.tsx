import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CategoryPage from "../../pages/category/[[...slug]]";

jest.mock("next/router", () => ({
  useRouter: jest.fn(() => ({
    query: { slug: ["electronics", "laptops"] },
    isReady: true,
  })),
}));

describe("Category Page", () => {
  it("renders category page title", () => {
    render(<CategoryPage />);
    expect(screen.getByText("Category Page")).toBeInTheDocument();
  });

  it("displays slug parameters", () => {
    render(<CategoryPage />);
    expect(screen.getByText("electronics")).toBeInTheDocument();
    expect(screen.getByText("laptops")).toBeInTheDocument();
  });

  it("renders without crashing", () => {
    const page = render(<CategoryPage />);
    expect(page).toBeTruthy();
  });
});

describe("Category Page - No Parameters", () => {
  it("should display 'No parameter' when slug is not provided", () => {
    const mockUseRouter = require("next/router").useRouter;
    mockUseRouter.mockReturnValueOnce({
      query: { slug: undefined },
      isReady: true,
    });

    render(<CategoryPage />);
    expect(screen.getByText("No parameter")).toBeInTheDocument();
  });
});

describe("Category Page - Single Parameter", () => {
  it("should display single slug parameter", () => {
    const mockUseRouter = require("next/router").useRouter;
    mockUseRouter.mockReturnValueOnce({
      query: { slug: "electronics" },
      isReady: true,
    });

    render(<CategoryPage />);
    expect(screen.getByText("electronics")).toBeInTheDocument();
  });
});
