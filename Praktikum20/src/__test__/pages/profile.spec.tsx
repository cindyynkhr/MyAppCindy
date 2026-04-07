import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import HalamanProfile from "../../pages/profile/index";

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(() => ({
    data: {
      user: {
        fullname: "John Doe",
      },
    },
  })),
}));

describe("Profile Page", () => {
  it("renders profile page title", () => {
    render(<HalamanProfile />);
    expect(screen.getByText("Halaman Profile")).toBeInTheDocument();
  });

  it("displays welcome message with user name", () => {
    render(<HalamanProfile />);
    expect(screen.getByText("Selamat datang, John Doe")).toBeInTheDocument();
  });

  it("renders without crashing", () => {
    const page = render(<HalamanProfile />);
    expect(page).toBeTruthy();
  });
});

describe("Profile Page - Without Session", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should handle null session data", () => {
    const mockUseSession = require("next-auth/react").useSession;
    mockUseSession.mockReturnValueOnce({
      data: null,
    });

    render(<HalamanProfile />);
    expect(screen.getByText("Halaman Profile")).toBeInTheDocument();
  });

  it("should handle undefined user data", () => {
    const mockUseSession = require("next-auth/react").useSession;
    mockUseSession.mockReturnValueOnce({
      data: {
        user: undefined,
      },
    });

    render(<HalamanProfile />);
    expect(screen.getByText("Halaman Profile")).toBeInTheDocument();
  });
});
