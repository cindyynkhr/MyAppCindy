import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "../../pages/index";

jest.mock("next/head", () => ({
  __esModule: true,
  default: ({ children }: any) => {
    return <>{children}</>;
  },
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }: any) => <img src={src} alt={alt} />,
}));

describe("Home Page", () => {
  it("renders home page with title", () => {
    render(<Home />);
    expect(screen.getByText("Praktikum Next.js Pages Router")).toBeInTheDocument();
  });

  it("displays welcome message", () => {
    render(<Home />);
    expect(screen.getByText("Mahasiswa D4 Pengembangan Web")).toBeInTheDocument();
  });

  it("should render link to about page", () => {
    render(<Home />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/about");
    expect(link).toHaveTextContent("Ke halaman About");
  });

  it("renders without crashing", () => {
    const page = render(<Home />);
    expect(page).toBeTruthy();
  });
});
