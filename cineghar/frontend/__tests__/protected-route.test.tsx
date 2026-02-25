import React from "react";
import { render, screen } from "@testing-library/react";
import ProtectedRoute from "@/app/_components/ProtectedRoute";

const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
}));

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: { email: "user@example.com", role: "user" },
    isLoading: false,
    isAuthenticated: true,
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    updateUser: jest.fn(),
  }),
}));

describe("ProtectedRoute", () => {
  it("renders children when user is authenticated and not admin", () => {
    render(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    );

    expect(
      screen.getByTestId("protected-content")
    ).toBeInTheDocument();
  });
});

