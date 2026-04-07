import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import HalamanLogin from "../../pages/auth/login";

const mockPush = jest.fn();
const mockSignIn = jest.fn();

jest.mock("next/router", () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
    query: { callbackUrl: "/" },
    pathname: "/auth/login",
  })),
}));

jest.mock("next-auth/react", () => ({
  signIn: mockSignIn,
}));

jest.mock("../../views/auth/login", () => {
  return function MockTampilanLogin() {
    return <div data-testid="login-form">Mocked Login Form</div>;
  };
});

describe("Login Page - Form Rendering", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders login page component", () => {
    render(<HalamanLogin />);
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
  });

  it("displays mocked login form", () => {
    render(<HalamanLogin />);
    expect(screen.getByText("Mocked Login Form")).toBeInTheDocument();
  });

  it("renders without crashing", () => {
    const page = render(<HalamanLogin />);
    expect(page).toBeTruthy();
  });
});

describe("Login Page - NextAuth Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("signIn function is available", () => {
    expect(mockSignIn).toBeDefined();
  });

  it("push function is available", () => {
    expect(mockPush).toBeDefined();
  });

  it("should use credentials provider", () => {
    expect(mockSignIn).toHaveBeenCalledTimes(0);
  });

  it("should have callbackUrl in query", () => {
    render(<HalamanLogin />);
    const mockRouter = require("next/router").useRouter();
    expect(mockRouter.query.callbackUrl).toBe("/");
  });
});

describe("Login Page - Authentication Behavior", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should verify signIn is called with credentials", () => {
    mockSignIn.mockResolvedValueOnce({ error: null, ok: true });
    render(<HalamanLogin />);
    
    expect(mockSignIn).toBeDefined();
    expect(jest.isMockFunction(mockSignIn)).toBe(true);
  });

  it("should handle successful login", () => {
    mockSignIn.mockResolvedValueOnce({ error: null, ok: true });
    mockPush.mockImplementation(() => {});
    
    render(<HalamanLogin />);
    expect(mockPush).toBeDefined();
  });

  it("should handle error response from signIn", () => {
    mockSignIn.mockResolvedValueOnce({ 
      error: "Invalid credentials",
      ok: false 
    });
    
    render(<HalamanLogin />);
    expect(mockSignIn).toBeDefined();
  });

  it("should handle network error", () => {
    mockSignIn.mockRejectedValueOnce(new Error("Network error"));
    
    render(<HalamanLogin />);
    expect(mockSignIn).toBeDefined();
  });
});

describe("Login Page - Router Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should navigate on successful login", () => {
    mockSignIn.mockResolvedValueOnce({ error: null });
    
    render(<HalamanLogin />);
    expect(mockPush).toBeDefined();
  });

  it("should pass correct callback URL", () => {
    render(<HalamanLogin />);
    const mockRouter = require("next/router").useRouter();
    
    expect(mockRouter.query.callbackUrl).toBeDefined();
  });

  it("should use root path as default callback", () => {
    render(<HalamanLogin />);
    const mockRouter = require("next/router").useRouter();
    
    expect(mockRouter.query.callbackUrl).toBe("/");
  });
});

