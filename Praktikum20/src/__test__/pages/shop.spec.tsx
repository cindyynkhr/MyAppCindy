import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import HalamanToko from "../../pages/shop/[[...slug]]";

jest.mock("next/router", () => ({
  useRouter: jest.fn(() => ({
    query: { slug: ["electronics"] },
    isReady: true,
  })),
}));

describe("Shop Page", () => {
  it("renders shop page title", () => {
    render(<HalamanToko />);
    expect(screen.getByText("Halaman Toko")).toBeInTheDocument();
  });

  it("displays category from slug parameter", () => {
    render(<HalamanToko />);
    expect(screen.getByText("Kategori: electronics")).toBeInTheDocument();
  });

  it("renders without crashing", () => {
    const page = render(<HalamanToko />);
    expect(page).toBeTruthy();
  });
});

describe("Shop Page - No Parameters", () => {
  it("should display 'Semua Kategori' when slug is not provided", () => {
    const mockUseRouter = require("next/router").useRouter;
    mockUseRouter.mockReturnValueOnce({
      query: { slug: undefined },
      isReady: true,
    });

    render(<HalamanToko />);
    expect(screen.getByText("Kategori: Semua Kategori")).toBeInTheDocument();
  });
});

describe("Shop Page - Multiple Parameters", () => {
  it("should display first slug parameter", () => {
    const mockUseRouter = require("next/router").useRouter;
    mockUseRouter.mockReturnValueOnce({
      query: { slug: ["fashion", "mens", "shirts"] },
      isReady: true,
    });

    render(<HalamanToko />);
    expect(screen.getByText("Kategori: fashion")).toBeInTheDocument();
  });
});
