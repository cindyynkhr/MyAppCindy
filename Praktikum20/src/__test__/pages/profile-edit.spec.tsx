import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import EditProfile from "../../pages/profile/edit";

describe("Edit Profile Page", () => {
  it("renders edit profile page title", () => {
    render(<EditProfile />);
    expect(screen.getByText("Edit Profile Page")).toBeInTheDocument();
  });

  it("displays edit profile description", () => {
    render(<EditProfile />);
    expect(screen.getByText("Ini halaman edit profile.")).toBeInTheDocument();
  });

  it("renders without crashing", () => {
    const page = render(<EditProfile />);
    expect(page).toBeTruthy();
  });
});
