import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import HalamanEditor from "../../pages/editor/index";

describe("Editor Page", () => {
  it("renders editor page title", () => {
    render(<HalamanEditor />);
    expect(screen.getByText("Halaman Editor")).toBeInTheDocument();
  });

  it("displays editor page description", () => {
    render(<HalamanEditor />);
    expect(screen.getByText(/Selamat datang di halaman editor/i)).toBeInTheDocument();
  });

  it("should mention content management", () => {
    render(<HalamanEditor />);
    expect(screen.getByText(/mengelola konten/i)).toBeInTheDocument();
  });

  it("should mention article creation", () => {
    render(<HalamanEditor />);
    expect(screen.getByText(/membuat artikel baru/i)).toBeInTheDocument();
  });

  it("should mention publishing capability", () => {
    render(<HalamanEditor />);
    expect(screen.getByText(/mempublikasikan/i)).toBeInTheDocument();
  });

  it("renders without crashing", () => {
    const page = render(<HalamanEditor />);
    expect(page).toBeTruthy();
  });
});
