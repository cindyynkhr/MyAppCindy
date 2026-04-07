import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import HalamanAdmin from "../../pages/admin/index";

describe("Admin Page", () => {
  it("renders admin page title", () => {
    render(<HalamanAdmin />);
    expect(screen.getByText("Halaman Admin")).toBeInTheDocument();
  });

  it("displays admin page description", () => {
    render(<HalamanAdmin />);
    expect(screen.getByText(/Selamat datang di halaman admin/i)).toBeInTheDocument();
  });

  it("should mention access to features", () => {
    render(<HalamanAdmin />);
    expect(screen.getByText(/mengelola pengguna/i)).toBeInTheDocument();
  });

  it("should mention data security", () => {
    render(<HalamanAdmin />);
    expect(screen.getByText(/keamanan data pengguna/i)).toBeInTheDocument();
  });

  it("renders without crashing", () => {
    const page = render(<HalamanAdmin />);
    expect(page).toBeTruthy();
  });
});
