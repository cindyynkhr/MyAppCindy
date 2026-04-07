import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import BlogSlug from "../../pages/blog/[slug]";

jest.mock("next/router", () => ({
  useRouter: jest.fn(() => ({
    query: { slug: "my-first-blog" },
    isReady: true,
  })),
}));

describe("Blog Detail Page", () => {
  it("renders blog detail page title", () => {
    render(<BlogSlug />);
    expect(screen.getByText("Blog Detail")).toBeInTheDocument();
  });

  it("displays slug parameter", () => {
    render(<BlogSlug />);
    expect(screen.getByText("Slug: my-first-blog")).toBeInTheDocument();
  });

  it("renders without crashing", () => {
    const page = render(<BlogSlug />);
    expect(page).toBeTruthy();
  });
});

describe("Blog Detail Page - Different Slugs", () => {
  it("should display different slug values", () => {
    const mockUseRouter = require("next/router").useRouter;
    mockUseRouter.mockReturnValueOnce({
      query: { slug: "how-to-setup-nextjs" },
      isReady: true,
    });

    render(<BlogSlug />);
    expect(screen.getByText("Slug: how-to-setup-nextjs")).toBeInTheDocument();
  });
});

describe("Blog Detail Page - No Slug", () => {
  it("should handle no slug parameter", () => {
    const mockUseRouter = require("next/router").useRouter;
    mockUseRouter.mockReturnValueOnce({
      query: { slug: undefined },
      isReady: true,
    });

    render(<BlogSlug />);
    expect(screen.getByText(/Slug:/)).toBeInTheDocument();
  });
});
