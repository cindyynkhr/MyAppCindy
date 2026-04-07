import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AppSetting from "../../pages/setting/app";

describe("App Setting Page", () => {
  it("renders app setting page title", () => {
    render(<AppSetting />);
    expect(screen.getByText("App Setting Page")).toBeInTheDocument();
  });

  it("renders without crashing", () => {
    const page = render(<AppSetting />);
    expect(page).toBeTruthy();
  });
});
