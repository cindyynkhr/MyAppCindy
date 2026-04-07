import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Custom404 from "../../pages/404";

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

describe("404 Not Found Page", () => {
  it("renders 404 error title", () => {
    render(<Custom404 />);
    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("displays error description", () => {
    render(<Custom404 />);
    expect(screen.getByText("Halaman yang Anda cari tidak ditemukan.")).toBeInTheDocument();
  });

  it("displays information message", () => {
    render(<Custom404 />);
    expect(screen.getByText(/Silakan periksa kembali URL/i)).toBeInTheDocument();
  });

  it("renders 404 image", () => {
    render(<Custom404 />);
    const image = screen.getByAltText("404");
    expect(image).toBeInTheDocument();
  });

  it("should have link to home page", () => {
    render(<Custom404 />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/");
    expect(link).toHaveTextContent("Kembali ke Home");
  });

  it("renders without crashing", () => {
    const page = render(<Custom404 />);
    expect(page).toBeTruthy();
  });
});
