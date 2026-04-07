import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import HalamanRegister from "../../pages/auth/register";

jest.mock("../../views/auth/register", () => {
  return function MockTampilanRegister() {
    return <div data-testid="register-view">Register View Component</div>;
  };
});

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe("Register Page", () => {
  it("renders register page", () => {
    render(<HalamanRegister />);
    expect(screen.getByTestId("register-view")).toBeInTheDocument();
  });

  it("displays register view component", () => {
    render(<HalamanRegister />);
    expect(screen.getByText("Register View Component")).toBeInTheDocument();
  });

  it("renders without crashing", () => {
    const page = render(<HalamanRegister />);
    expect(page).toBeTruthy();
  });
});
