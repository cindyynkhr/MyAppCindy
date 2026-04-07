import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import HalamanProduk from "../../pages/product/[produk]";

jest.mock("next/dynamic", () => ({
  __esModule: true,
  default: (...args: any[]) => {
    const dynamicModule = jest.requireActual("next/dynamic");
    const dynamicActualComp = dynamicModule.default;
    const RequiredComponent = dynamicActualComp(args[0]);
    RequiredComponent.preload ? RequiredComponent.preload() : RequiredComponent.render.preload?.();
    return RequiredComponent;
  },
}));

jest.mock("../../views/detailProduct", () => {
  return function MockDetailProduk({ product }: any) {
    return <div data-testid="detail-product">Product: {product?.name}</div>;
  };
});

const mockProduct = {
  id: "1",
  name: "Test Product",
  price: 50000,
  images: "/test.jpg",
  category: "Electronics",
};

describe("Product Detail Page", () => {
  it("renders product detail page", () => {
    render(<HalamanProduk product={mockProduct} />);
    expect(screen.getByTestId("detail-product")).toBeInTheDocument();
  });

  it("passes product prop to DetailProduk component", () => {
    render(<HalamanProduk product={mockProduct} />);
    expect(screen.getByText("Product: Test Product")).toBeInTheDocument();
  });

  it("renders without crashing", () => {
    const page = render(<HalamanProduk product={mockProduct} />);
    expect(page).toBeTruthy();
  });

  it("should handle different products", () => {
    const anotherProduct = {
      id: "2",
      name: "Laptop",
      price: 5000000,
      images: "/laptop.jpg",
      category: "Electronics",
    };

    render(<HalamanProduk product={anotherProduct} />);
    expect(screen.getByText("Product: Laptop")).toBeInTheDocument();
  });
});
