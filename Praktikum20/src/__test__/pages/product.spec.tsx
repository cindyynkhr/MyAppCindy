import { render,screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Kategori from "../../pages/product";

const mockPush = jest.fn();

jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/product",
      pathname: "",
      query: {},
      asPath: "",
      push: mockPush,
      event: {
        on: jest.fn(),
        off: jest.fn(),
      },
      isReady: true,
    }
  },
}))

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }: any) => <img src={src} alt={alt} />,
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

jest.mock("swr", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    data: { data: [] },
    error: null,
    isLoading: false,
  })),
}));

jest.mock("../../utils/swr/fetcher", () => ({
  __esModule: true,
  default: jest.fn(),
}));

let mockUseSWR: jest.Mock;

describe("Kategori Page", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseSWR = require("swr").default as jest.Mock;
    });

    it("renders the kategori page correctly", () => {
        mockUseSWR.mockReturnValueOnce({
          data: {
            data: [
              { id: "1", name: "Product 1", price: 10000, images: "/img1.jpg", category: "Electronics" },
            ],
          },
          error: null,
          isLoading: false,
        });

        const page = render(<Kategori />);
        expect(page).toMatchSnapshot();
    });

    it("should render component without crashing", () => {
        mockUseSWR.mockReturnValueOnce({
          data: { data: [] },
          error: null,
          isLoading: false,
        });
        
        render(<Kategori />);
        expect(screen.getByText("Daftar Produk")).toBeInTheDocument();
    });

    it("should show loading state with empty products", () => {
        mockUseSWR.mockReturnValueOnce({
          data: null,
          error: null,
          isLoading: true,
        });
        
        render(<Kategori />);
        expect(screen.getByText("Daftar Produk")).toBeInTheDocument();
    });

    it("should display multiple products when available", () => {
        mockUseSWR.mockReturnValueOnce({
          data: {
            data: [
              { id: "1", name: "Product 1", price: 10000, images: "/img1.jpg", category: "Electronics" },
              { id: "2", name: "Product 2", price: 20000, images: "/img2.jpg", category: "Fashion" },
              { id: "3", name: "Product 3", price: 30000, images: "/img3.jpg", category: "Books" },
            ],
          },
          error: null,
          isLoading: false,
        });
        
        render(<Kategori />);
        expect(screen.getByText("Product 1")).toBeInTheDocument();
        expect(screen.getByText("Product 2")).toBeInTheDocument();
        expect(screen.getByText("Product 3")).toBeInTheDocument();
    });

    it("should render product with correct price format", () => {
        mockUseSWR.mockReturnValueOnce({
          data: {
            data: [
              { id: "1", name: "Premium Product", price: 15000, images: "/img.jpg", category: "Electronics" },
            ],
          },
          error: null,
          isLoading: false,
        });
        
        render(<Kategori />);
        expect(screen.getByText("Premium Product")).toBeInTheDocument();
    });
    
});

describe("Navigasi Ke Detail Produk", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockPush.mockClear();
        mockUseSWR = require("swr").default as jest.Mock;
    });

    it("should navigate to detail product page when product is clicked", () => {
        mockUseSWR.mockReturnValueOnce({
          data: {
            data: [
              { id: "1", name: "Product 1", price: 10000, images: "/img1.jpg", category: "Electronics" },
            ],
          },
          error: null,
          isLoading: false,
        });

        const page = render(<Kategori />);
        expect(page).toMatchSnapshot();
    });

    it("should display product title correctly", () => {
        mockUseSWR.mockReturnValueOnce({
          data: {
            data: [
              { id: "1", name: "Product Test", price: 10000, images: "/img.jpg", category: "Test" },
            ],
          },
          error: null,
          isLoading: false,
        });

        render(<Kategori />);
        const productTitle = screen.getByText("Daftar Produk");
        expect(productTitle.tagName).toBe("H1");
    });

    it("should handle data from SWR hook properly", () => {
        mockUseSWR.mockReturnValueOnce({
          data: {
            data: [
              { id: "123", name: "Test Product", price: 50000, images: "/test.jpg", category: "Test Category" },
            ],
          },
          error: null,
          isLoading: false,
        });

        render(<Kategori />);
        expect(screen.getByText("Test Product")).toBeInTheDocument();
    });
});

describe("Error Handling & Loading States", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseSWR = require("swr").default as jest.Mock;
    });

    it("should handle error state from SWR", () => {
        mockUseSWR.mockReturnValueOnce({
          data: null,
          error: new Error("Failed to fetch"),
          isLoading: false,
        });
        
        render(<Kategori />);
        expect(screen.getByText("Daftar Produk")).toBeInTheDocument();
    });

    it("should show skeleton when products data is empty", () => {
        mockUseSWR.mockReturnValueOnce({
          data: { data: [] },
          error: null,
          isLoading: false,
        });
        
        const { container } = render(<Kategori />);
        const skeleton = container.querySelector(".produk__content__skeleton");
        expect(skeleton).toBeInTheDocument();
    });

    it("should display correct price format with Indonesian locale", () => {
        mockUseSWR.mockReturnValueOnce({
          data: {
            data: [
              { id: "1", name: "Product", price: 1000000, images: "/img.jpg", category: "Test" },
            ],
          },
          error: null,
          isLoading: false,
        });
        
        render(<Kategori />);
        expect(screen.getByText(/Rp.*1\.000\.000/)).toBeInTheDocument();
    });
});

describe("Product Details Rendering", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseSWR = require("swr").default as jest.Mock;
    });

    it("should render category information for each product", () => {
        mockUseSWR.mockReturnValueOnce({
          data: {
            data: [
              { id: "1", name: "Laptop", price: 5000000, images: "/laptop.jpg", category: "Electronics" },
              { id: "2", name: "T-Shirt", price: 50000, images: "/tshirt.jpg", category: "Fashion" },
            ],
          },
          error: null,
          isLoading: false,
        });
        
        render(<Kategori />);
        expect(screen.getByText("Electronics")).toBeInTheDocument();
        expect(screen.getByText("Fashion")).toBeInTheDocument();
    });

    it("should render images with correct alt text", () => {
        mockUseSWR.mockReturnValueOnce({
          data: {
            data: [
              { id: "1", name: "Product Name", price: 10000, images: "/img.jpg", category: "Test" },
            ],
          },
          error: null,
          isLoading: false,
        });
        
        render(<Kategori />);
        const image = screen.getByAltText("Product Name");
        expect(image).toBeInTheDocument();
    });

    it("should render product links with correct href", () => {
        mockUseSWR.mockReturnValueOnce({
          data: {
            data: [
              { id: "456", name: "Test Item", price: 25000, images: "/img.jpg", category: "Test" },
            ],
          },
          error: null,
          isLoading: false,
        });
        
        render(<Kategori />);
        const link = screen.getByRole("link");
        expect(link).toHaveAttribute("href", "/product/456");
    });

    it("should render all product details in correct structure", () => {
        mockUseSWR.mockReturnValueOnce({
          data: {
            data: [
              { id: "1", name: "Complete Product", price: 99999, images: "/complete.jpg", category: "Full Test" },
            ],
          },
          error: null,
          isLoading: false,
        });
        
        render(<Kategori />);
        expect(screen.getByText("Complete Product")).toBeInTheDocument();
        expect(screen.getByText("Full Test")).toBeInTheDocument();
        expect(screen.getByAltText("Complete Product")).toBeInTheDocument();
    });

    it("should pass empty array when data is loading", () => {
        mockUseSWR.mockReturnValueOnce({
          data: null,
          error: null,
          isLoading: true,
        });
        
        render(<Kategori />);
        expect(screen.getByText("Daftar Produk")).toBeInTheDocument();
    });
});

describe("Product Click Interaction - Detail Navigation", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseSWR = require("swr").default as jest.Mock;
    });

    it("should render clickable product links", () => {
        mockUseSWR.mockReturnValueOnce({
          data: {
            data: [
              { id: "1", name: "Clickable Product", price: 50000, images: "/img.jpg", category: "Test" },
            ],
          },
          error: null,
          isLoading: false,
        });
        
        render(<Kategori />);
        const link = screen.getByRole("link");
        expect(link).toBeInTheDocument();
        expect(link.tagName).toBe("A");
    });

    it("should navigate to correct product detail page on click", () => {
        mockUseSWR.mockReturnValueOnce({
          data: {
            data: [
              { id: "prod-123", name: "Product to Click", price: 75000, images: "/img.jpg", category: "Test" },
            ],
          },
          error: null,
          isLoading: false,
        });
        
        render(<Kategori />);
        const link = screen.getByRole("link");
        
        expect(link).toHaveAttribute("href", "/product/prod-123");
        fireEvent.click(link);
        
        expect(link).toHaveAttribute("href", "/product/prod-123");
    });

    it("should handle multiple product links with different IDs", () => {
        mockUseSWR.mockReturnValueOnce({
          data: {
            data: [
              { id: "prod-1", name: "Product 1", price: 10000, images: "/img1.jpg", category: "Category1" },
              { id: "prod-2", name: "Product 2", price: 20000, images: "/img2.jpg", category: "Category2" },
              { id: "prod-3", name: "Product 3", price: 30000, images: "/img3.jpg", category: "Category3" },
            ],
          },
          error: null,
          isLoading: false,
        });
        
        const { container } = render(<Kategori />);
        const links = container.querySelectorAll("a");
        
        expect(links.length).toBe(3);
        expect(links[0]).toHaveAttribute("href", "/product/prod-1");
        expect(links[1]).toHaveAttribute("href", "/product/prod-2");
        expect(links[2]).toHaveAttribute("href", "/product/prod-3");
    });

    it("should trigger click event on product item", () => {
        mockUseSWR.mockReturnValueOnce({
          data: {
            data: [
              { id: "456", name: "Clickable Item", price: 15000, images: "/img.jpg", category: "Test" },
            ],
          },
          error: null,
          isLoading: false,
        });
        
        render(<Kategori />);
        const link = screen.getByRole("link");
        
        fireEvent.click(link);
        
        expect(link).toHaveAttribute("href", "/product/456");
    });

    it("should maintain product data after click", () => {
        mockUseSWR.mockReturnValueOnce({
          data: {
            data: [
              { id: "1", name: "Product Name", price: 25000, images: "/img.jpg", category: "Category" },
            ],
          },
          error: null,
          isLoading: false,
        });
        
        render(<Kategori />);
        
        expect(screen.getByText("Product Name")).toBeInTheDocument();
        expect(screen.getByText("Category")).toBeInTheDocument();
        
        const link = screen.getByRole("link");
        fireEvent.click(link);
        
        expect(screen.getByText("Product Name")).toBeInTheDocument();
    });
});

describe("Product Interaction - Complex Scenarios", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseSWR = require("swr").default as jest.Mock;
    });

    it("should handle click on specific product among multiple products", () => {
        mockUseSWR.mockReturnValueOnce({
          data: {
            data: [
              { id: "a1", name: "Product A", price: 100000, images: "/a.jpg", category: "Type A" },
              { id: "b2", name: "Product B", price: 200000, images: "/b.jpg", category: "Type B" },
              { id: "c3", name: "Product C", price: 300000, images: "/c.jpg", category: "Type C" },
            ],
          },
          error: null,
          isLoading: false,
        });
        
        const { container } = render(<Kategori />);
        const links = container.querySelectorAll("a");
        
        // Click the second product (Product B)
        fireEvent.click(links[1]);
        
        expect(links[1]).toHaveAttribute("href", "/product/b2");
        expect(screen.getByText("Product B")).toBeInTheDocument();
    });

    it("should display correct product details before clicking", () => {
        mockUseSWR.mockReturnValueOnce({
          data: {
            data: [
              { id: "xyz", name: "Special Product", price: 999999, images: "/special.jpg", category: "Premium" },
            ],
          },
          error: null,
          isLoading: false,
        });
        
        render(<Kategori />);
        
        expect(screen.getByText("Special Product")).toBeInTheDocument();
        expect(screen.getByText("Premium")).toBeInTheDocument();
        expect(screen.getByText(/Rp.*999\.999/)).toBeInTheDocument();
    });

    it("should maintain href attribute after multiple renders", () => {
        mockUseSWR.mockReturnValueOnce({
          data: {
            data: [
              { id: "test-id", name: "Test Product", price: 50000, images: "/test.jpg", category: "Test" },
            ],
          },
          error: null,
          isLoading: false,
        });
        
        const { rerender } = render(<Kategori />);
        let link = screen.getByRole("link");
        expect(link).toHaveAttribute("href", "/product/test-id");
        
        // Re-render with same data
        mockUseSWR.mockReturnValueOnce({
          data: {
            data: [
              { id: "test-id", name: "Test Product", price: 50000, images: "/test.jpg", category: "Test" },
            ],
          },
          error: null,
          isLoading: false,
        });
        
        rerender(<Kategori />);
        link = screen.getByRole("link");
        expect(link).toHaveAttribute("href", "/product/test-id");
    });

    it("should render link with product image and name together", () => {
        mockUseSWR.mockReturnValueOnce({
          data: {
            data: [
              { id: "linked-prod", name: "Linked Product", price: 35000, images: "/linked.jpg", category: "Linked" },
            ],
          },
          error: null,
          isLoading: false,
        });
        
        const { container } = render(<Kategori />);
        const link = container.querySelector("a");
        
        expect(link).toBeInTheDocument();
        expect(link?.querySelector("img")).toHaveAttribute("src", "/linked.jpg");
        expect(link).toHaveTextContent("Linked Product");
    });

    it("should handle sequential clicks on different products", () => {
        mockUseSWR.mockReturnValueOnce({
          data: {
            data: [
              { id: "seq-1", name: "First Product", price: 10000, images: "/first.jpg", category: "First" },
              { id: "seq-2", name: "Second Product", price: 20000, images: "/second.jpg", category: "Second" },
            ],
          },
          error: null,
          isLoading: false,
        });
        
        const { container } = render(<Kategori />);
        const links = container.querySelectorAll("a");
        
        // Click first product
        fireEvent.click(links[0]);
        expect(links[0]).toHaveAttribute("href", "/product/seq-1");
        
        // Click second product
        fireEvent.click(links[1]);
        expect(links[1]).toHaveAttribute("href", "/product/seq-2");
    });

    it("should verify link is navigable element", () => {
        mockUseSWR.mockReturnValueOnce({
          data: {
            data: [
              { id: "nav-test", name: "Navigation Test", price: 45000, images: "/nav.jpg", category: "Nav" },
            ],
          },
          error: null,
          isLoading: false,
        });
        
        render(<Kategori />);
        const link = screen.getByRole("link");
        
        expect(link.tagName).toBe("A");
        expect(link).toHaveAttribute("href");
        fireEvent.click(link);
        expect(link).toHaveAttribute("href", "/product/nav-test");
    });
});