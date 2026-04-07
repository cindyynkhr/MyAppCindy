import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Appshell from "../../../components/layouts/Appshell";

const mockPush = jest.fn();
const mockUseRouter = jest.fn();

jest.mock("next/router", () => ({
  useRouter: () => mockUseRouter(),
}));

jest.mock("next/font/google", () => ({
  Roboto: () => ({
    className: "roboto-mock",
  }),
}));

jest.mock("../../../components/layouts/navbar", () => {
  return function MockNavbar() {
    return <nav data-testid="navbar">Navbar Component</nav>;
  };
});

describe("AppShell Layout - Navbar Rendering", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render AppShell with children", () => {
    mockUseRouter.mockReturnValue({
      pathname: "/",
      push: mockPush,
    });

    render(
      <Appshell>
        <div>Test Content</div>
      </Appshell>
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("should render navbar on home page", () => {
    mockUseRouter.mockReturnValue({
      pathname: "/",
      push: mockPush,
    });

    render(
      <Appshell>
        <div>Home Page</div>
      </Appshell>
    );

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
  });

  it("should render navbar on about page", () => {
    mockUseRouter.mockReturnValue({
      pathname: "/about",
      push: mockPush,
    });

    render(
      <Appshell>
        <div>About Page</div>
      </Appshell>
    );

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
  });

  it("should render navbar on product page", () => {
    mockUseRouter.mockReturnValue({
      pathname: "/product",
      push: mockPush,
    });

    render(
      <Appshell>
        <div>Product Page</div>
      </Appshell>
    );

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
  });

  it("should render navbar on admin page", () => {
    mockUseRouter.mockReturnValue({
      pathname: "/admin",
      push: mockPush,
    });

    render(
      <Appshell>
        <div>Admin Page</div>
      </Appshell>
    );

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
  });

  it("should render navbar on profile page", () => {
    mockUseRouter.mockReturnValue({
      pathname: "/profile",
      push: mockPush,
    });

    render(
      <Appshell>
        <div>Profile Page</div>
      </Appshell>
    );

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
  });
});

describe("AppShell Layout - Hide Navbar on Auth Pages", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should NOT render navbar on login page", () => {
    mockUseRouter.mockReturnValue({
      pathname: "/auth/login",
      push: mockPush,
    });

    render(
      <Appshell>
        <div>Login Page</div>
      </Appshell>
    );

    expect(screen.queryByTestId("navbar")).not.toBeInTheDocument();
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("should NOT render navbar on register page", () => {
    mockUseRouter.mockReturnValue({
      pathname: "/auth/register",
      push: mockPush,
    });

    render(
      <Appshell>
        <div>Register Page</div>
      </Appshell>
    );

    expect(screen.queryByTestId("navbar")).not.toBeInTheDocument();
    expect(screen.getByText("Register Page")).toBeInTheDocument();
  });

  it("should NOT render navbar on 404 page", () => {
    mockUseRouter.mockReturnValue({
      pathname: "/404",
      push: mockPush,
    });

    render(
      <Appshell>
        <div>Page Not Found</div>
      </Appshell>
    );

    expect(screen.queryByTestId("navbar")).not.toBeInTheDocument();
    expect(screen.getByText("Page Not Found")).toBeInTheDocument();
  });
});

describe("AppShell Layout - Conditional Navbar Logic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should have disableNavbar list for auth routes", () => {
    mockUseRouter.mockReturnValue({
      pathname: "/auth/login",
      push: mockPush,
    });

    render(
      <Appshell>
        <div>Content</div>
      </Appshell>
    );

    expect(screen.queryByTestId("navbar")).not.toBeInTheDocument();
  });

  it("should render navbar for all non-auth routes", () => {
    const testRoutes = ["/", "/about", "/product", "/admin", "/profile", "/editor"];

    testRoutes.forEach((route) => {
      jest.clearAllMocks();
      mockUseRouter.mockReturnValue({
        pathname: route,
        push: mockPush,
      });

      const { unmount } = render(
        <Appshell>
          <div>{route}</div>
        </Appshell>
      );

      expect(screen.getByTestId("navbar")).toBeInTheDocument();
      unmount();
    });
  });

  it("should switch navbar visibility when pathname changes", () => {
    mockUseRouter.mockReturnValue({
      pathname: "/",
      push: mockPush,
    });

    const { rerender } = render(
      <Appshell>
        <div>Home</div>
      </Appshell>
    );

    expect(screen.getByTestId("navbar")).toBeInTheDocument();

    // Change to auth/login (should hide navbar)
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      pathname: "/auth/login",
      push: mockPush,
    });

    rerender(
      <Appshell>
        <div>Login</div>
      </Appshell>
    );

    expect(screen.queryByTestId("navbar")).not.toBeInTheDocument();
  });

  it("should handle multiple auth routes correctly", () => {
    const authRoutes = ["/auth/login", "/auth/register", "/404"];

    authRoutes.forEach((route) => {
      jest.clearAllMocks();
      mockUseRouter.mockReturnValue({
        pathname: route,
        push: mockPush,
      });

      const { unmount } = render(
        <Appshell>
          <div>{route}</div>
        </Appshell>
      );

      expect(screen.queryByTestId("navbar")).not.toBeInTheDocument();
      unmount();
    });
  });
});

describe("AppShell Layout - Children Rendering", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render children content correctly", () => {
    mockUseRouter.mockReturnValue({
      pathname: "/",
      push: mockPush,
    });

    render(
      <Appshell>
        <h1>Page Title</h1>
        <p>Page Content</p>
      </Appshell>
    );

    expect(screen.getByText("Page Title")).toBeInTheDocument();
    expect(screen.getByText("Page Content")).toBeInTheDocument();
  });

  it("should render complex children structure", () => {
    mockUseRouter.mockReturnValue({
      pathname: "/product",
      push: mockPush,
    });

    render(
      <Appshell>
        <div>
          <h2>Products</h2>
          <ul>
            <li>Product 1</li>
            <li>Product 2</li>
          </ul>
        </div>
      </Appshell>
    );

    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("Product 2")).toBeInTheDocument();
  });

  it("should render main element wrapping content", () => {
    mockUseRouter.mockReturnValue({
      pathname: "/",
      push: mockPush,
    });

    const { container } = render(
      <Appshell>
        <div>Content</div>
      </Appshell>
    );

    const mainElement = container.querySelector("main");
    expect(mainElement).toBeInTheDocument();
  });

  it("should render children both with and without navbar", () => {
    // With navbar
    mockUseRouter.mockReturnValue({
      pathname: "/",
      push: mockPush,
    });

    const { unmount } = render(
      <Appshell>
        <div>Page with Navbar</div>
      </Appshell>
    );

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByText("Page with Navbar")).toBeInTheDocument();

    unmount();

    // Without navbar
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      pathname: "/auth/login",
      push: mockPush,
    });

    render(
      <Appshell>
        <div>Page without Navbar</div>
      </Appshell>
    );

    expect(screen.queryByTestId("navbar")).not.toBeInTheDocument();
    expect(screen.getByText("Page without Navbar")).toBeInTheDocument();
  });
});
