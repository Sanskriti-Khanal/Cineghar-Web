import React from "react";
import { render, screen } from "@testing-library/react";
import Navbar from "@/app/_components/Navbar";

jest.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

jest.mock("next/image", () => (props: any) => (
  // eslint-disable-next-line jsx-a11y/alt-text
  <img {...props} />
));

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    isAuthenticated: false,
    user: null,
    logout: jest.fn(),
  }),
}));

jest.mock("@/lib/api/loyalty", () => ({
  getMyLoyaltyApi: jest.fn(),
}));

describe("Navbar", () => {
  it("shows public navigation links and auth buttons when not authenticated", () => {
    render(<Navbar />);

    expect(screen.getByText("CineGhar")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Features" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Movies" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Categories" })).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Signup" })).toBeInTheDocument();
  });
});

