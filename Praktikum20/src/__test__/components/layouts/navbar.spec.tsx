import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Navbar from "../../../components/layouts/navbar";

jest.mock("next/dist/client/script", () => {
  return function MockScript() {
    return null;
  };
});

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }: any) => <img src={src} alt={alt} />,
}));

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
  useSession: jest.fn(),
}));

// Get references to mocked functions after mock is established
const mockSignIn = (require("next-auth/react").signIn as jest.Mock);
const mockSignOut = (require("next-auth/react").signOut as jest.Mock);

const setupMockSession = (sessionData: any) => {
  const mockUseSession = require("next-auth/react").useSession;
  mockUseSession.mockReturnValue(sessionData);
};

describe("Navbar - Not Authenticated", () => {
  beforeEach(() => {
    mockSignIn.mockClear();
    mockSignOut.mockClear();
    setupMockSession({ data: null });
  });

  it("should render navbar component", () => {
    render(<Navbar />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should display Sign In button when not authenticated", () => {
    render(<Navbar />);
    const button = screen.getByRole("button", { name: /sign in/i });
    expect(button).toBeInTheDocument();
  });

  it("should have Sign In button with primary style", () => {
    render(<Navbar />);
    const button = screen.getByRole("button", { name: /sign in/i });
    expect(button).toHaveClass("navbar_button--primary");
  });

  it("should call signIn when Sign In button is clicked", () => {
    render(<Navbar />);
    const button = screen.getByRole("button", { name: /sign in/i });
    
    fireEvent.click(button);
    
    expect(mockSignIn).toHaveBeenCalled();
  });

  it("should not display user info when not authenticated", () => {
    render(<Navbar />);
    expect(screen.queryByText(/Welcome/i)).not.toBeInTheDocument();
  });

  it("should not display user image when not authenticated", () => {
    render(<Navbar />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});

describe("Navbar - Authenticated User", () => {
  beforeEach(() => {
    mockSignIn.mockClear();
    mockSignOut.mockClear();
    setupMockSession({
      data: {
        user: {
          fullName: "John Doe",
          email: "john@example.com",
          image: "/user-avatar.jpg",
        },
      },
    });
  });

  it("should display user welcome message", () => {
    render(<Navbar />);
    expect(screen.getByText(/Welcome, John Doe/i)).toBeInTheDocument();
  });

  it("should display user full name in navbar", () => {
    render(<Navbar />);
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
  });

  it("should display Sign Out button when authenticated", () => {
    render(<Navbar />);
    const button = screen.getByRole("button", { name: /sign out/i });
    expect(button).toBeInTheDocument();
  });

  it("should have Sign Out button with danger style", () => {
    render(<Navbar />);
    const button = screen.getByRole("button", { name: /sign out/i });
    expect(button).toHaveClass("navbar_button--danger");
  });

  it("should not display Sign In button when authenticated", () => {
    render(<Navbar />);
    expect(screen.queryByRole("button", { name: /sign in/i })).not.toBeInTheDocument();
  });

  it("should display user avatar image", () => {
    render(<Navbar />);
    const image = screen.getByAltText("John Doe");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/user-avatar.jpg");
  });

  it("should call signOut when Sign Out button is clicked", () => {
    render(<Navbar />);
    const button = screen.getByRole("button", { name: /sign out/i });
    
    fireEvent.click(button);
    
    expect(mockSignOut).toHaveBeenCalled();
  });
});

describe("Navbar - Different User Sessions", () => {
  beforeEach(() => {
    mockSignIn.mockClear();
    mockSignOut.mockClear();
  });

  it("should display different user names", () => {
    setupMockSession({
      data: {
        user: {
          fullName: "Alice Smith",
          email: "alice@example.com",
          image: "/alice.jpg",
        },
      },
    });

    render(<Navbar />);
    expect(screen.getByText(/Welcome, Alice Smith/i)).toBeInTheDocument();
  });

  it("should handle user without image", () => {
    setupMockSession({
      data: {
        user: {
          fullName: "Bob Johnson",
          email: "bob@example.com",
          image: null,
        },
      },
    });

    render(<Navbar />);
    expect(screen.getByText(/Welcome, Bob Johnson/i)).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("should display correct avatar for different users", () => {
    setupMockSession({
      data: {
        user: {
          fullName: "Charlie Brown",
          email: "charlie@example.com",
          image: "/charlie-avatar.png",
        },
      },
    });

    render(<Navbar />);
    const image = screen.getByAltText("Charlie Brown");
    expect(image).toHaveAttribute("src", "/charlie-avatar.png");
  });
});

describe("Navbar - Button States & Interactions", () => {
  beforeEach(() => {
    mockSignIn.mockClear();
    mockSignOut.mockClear();
  });

  it("should have clickable Sign In button", () => {
    setupMockSession({ data: null });

    render(<Navbar />);
    const button = screen.getByRole("button", { name: /sign in/i });
    
    expect(button).toBeEnabled();
    fireEvent.click(button);
    expect(mockSignIn).toHaveBeenCalledTimes(1);
  });

  it("should have clickable Sign Out button", () => {
    setupMockSession({
      data: {
        user: {
          fullName: "Test User",
          image: null,
        },
      },
    });

    render(<Navbar />);
    const button = screen.getByRole("button", { name: /sign out/i });
    
    expect(button).toBeEnabled();
    fireEvent.click(button);
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });

  it("should handle multiple sign in/out clicks", () => {
    setupMockSession({ data: null });

    render(<Navbar />);
    const button = screen.getByRole("button", { name: /sign in/i });
    
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);
    
    expect(mockSignIn).toHaveBeenCalledTimes(3);
  });
});

describe("Navbar - Layout & Structure", () => {
  beforeEach(() => {
    mockSignIn.mockClear();
    mockSignOut.mockClear();
    setupMockSession({ data: null });
  });

  it("should have navbar container", () => {
    const { container } = render(<Navbar />);
    const navbar = container.querySelector(".navbar");
    expect(navbar).toBeInTheDocument();
  });

  it("should have navbar brand section", () => {
    const { container } = render(<Navbar />);
    const brand = container.querySelector(".navbar_brand");
    expect(brand).toBeInTheDocument();
  });

  it("should have navbar right section with buttons", () => {
    const { container } = render(<Navbar />);
    const right = container.querySelector(".navbar_right");
    expect(right).toBeInTheDocument();
    expect(right?.querySelector("button")).toBeInTheDocument();
  });

  it("should have navbar user info container when authenticated", () => {
    setupMockSession({
      data: {
        user: {
          fullName: "Test User",
          image: "/test.jpg",
        },
      },
    });

    const { container } = render(<Navbar />);
    const userDiv = container.querySelector(".navbar_user");
    expect(userDiv).toBeInTheDocument();
  });
});
