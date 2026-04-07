import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TampilanProduk from "../../views/product";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }: any) => <img src={src} alt={alt} />,
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe("TampilanProduk Component", () => {
  it("renders title correctly", () => {
    const products = [
      { id: "1", name: "Product 1", price: 10000, images: "/img1.jpg", category: "Electronics" },
    ];
    render(<TampilanProduk products={products} />);
    expect(screen.getByText("Daftar Produk")).toBeInTheDocument();
  });

  it("should display product with correct information", () => {
    const products = [
      { id: "1", name: "Laptop", price: 10000000, images: "/laptop.jpg", category: "Electronics" },
    ];
    render(<TampilanProduk products={products} />);
    expect(screen.getByText("Laptop")).toBeInTheDocument();
    expect(screen.getByText("Electronics")).toBeInTheDocument();
  });

  it("should render multiple products", () => {
    const products = [
      { id: "1", name: "Product 1", price: 10000, images: "/img1.jpg", category: "Cat1" },
      { id: "2", name: "Product 2", price: 20000, images: "/img2.jpg", category: "Cat2" },
      { id: "3", name: "Product 3", price: 30000, images: "/img3.jpg", category: "Cat3" },
    ];
    render(<TampilanProduk products={products} />);
    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("Product 2")).toBeInTheDocument();
    expect(screen.getByText("Product 3")).toBeInTheDocument();
  });

  it("should display skeleton when no products", () => {
    render(<TampilanProduk products={[]} />);
    expect(screen.getByText("Daftar Produk")).toBeInTheDocument();
  });

  it("should render product links with correct href", () => {
    const products = [
      { id: "123", name: "Test Product", price: 50000, images: "/test.jpg", category: "Test" },
    ];
    render(<TampilanProduk products={products} />);
    const link = screen.getByRole("link", { name: /Test Product/i });
    expect(link).toHaveAttribute("href", "/product/123");
  });

  it("should render images with correct src", () => {
    const products = [
      { id: "1", name: "Product 1", price: 10000, images: "/img1.jpg", category: "Electronics" },
    ];
    render(<TampilanProduk products={products} />);
    const img = screen.getByAltText("Product 1");
    expect(img).toHaveAttribute("src", "/img1.jpg");
  });

  it("should handle empty products array", () => {
    render(<TampilanProduk products={[]} />);
    const title = screen.getByText("Daftar Produk");
    expect(title.tagName).toBe("H1");
  });

  it("should display product category information", () => {
    const products = [
      { id: "1", name: "Nike Shoes", price: 1500000, images: "/shoes.jpg", category: "Fashion" },
    ];
    render(<TampilanProduk products={products} />);
    expect(screen.getByText("Fashion")).toBeInTheDocument();
    expect(screen.getByText("Nike Shoes")).toBeInTheDocument();
  });

  it("renders snapshot correctly", () => {
    const products = [
      { id: "1", name: "Product A", price: 25000, images: "/a.jpg", category: "CategoryA" },
      { id: "2", name: "Product B", price: 35000, images: "/b.jpg", category: "CategoryB" },
    ];
    const page = render(<TampilanProduk products={products} />);
    expect(page).toMatchSnapshot();
  });
});
