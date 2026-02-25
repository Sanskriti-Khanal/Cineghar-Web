import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

jest.mock("@/app/_components/Navbar", () => () => <div>Navbar</div>);
jest.mock("@/app/_components/HeroSection", () => () => <div>HeroSection</div>);
jest.mock("@/app/_components/FeaturesSection", () => () => <div>FeaturesSection</div>);
jest.mock("@/app/_components/MoviesPreviewSection", () => () => <div>MoviesPreviewSection</div>);
jest.mock("@/app/_components/CategoriesSection", () => () => <div>CategoriesSection</div>);
jest.mock("@/app/_components/CTASection", () => () => <div>CTASection</div>);
jest.mock("@/app/_components/Footer", () => () => <div>Footer</div>);

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: null,
    isLoading: false,
    isAuthenticated: false,
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    updateUser: jest.fn(),
  }),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
  usePathname: () => "/",
}));

describe("Home page", () => {
  it("renders the public landing hero when user is not authenticated", () => {
    render(<Home />);

    expect(
      screen.getByText("HeroSection")
    ).toBeInTheDocument();
    expect(
      screen.getByText("FeaturesSection")
    ).toBeInTheDocument();
    expect(
      screen.getByText("MoviesPreviewSection")
    ).toBeInTheDocument();
  });
});

