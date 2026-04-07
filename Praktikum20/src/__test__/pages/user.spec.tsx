import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserSettingPage from "../../pages/user/index";

describe("User Setting Page", () => {
  it("renders user setting page title", () => {
    render(<UserSettingPage />);
    expect(screen.getByText("User Setting Page")).toBeInTheDocument();
  });

  it("renders without crashing", () => {
    const page = render(<UserSettingPage />);
    expect(page).toBeTruthy();
  });
});
