import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PasswordPage from "../../pages/user/password/index";

describe("User Password Page", () => {
  it("renders password page title", () => {
    render(<PasswordPage />);
    expect(screen.getByText("Password User Page")).toBeInTheDocument();
  });

  it("renders without crashing", () => {
    const page = render(<PasswordPage />);
    expect(page).toBeTruthy();
  });
});
