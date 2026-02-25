import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "@/app/(auth)/_components/LoginForm";

const mockLogin = jest.fn();

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: null,
    isLoading: false,
    isAuthenticated: false,
    login: mockLogin,
    register: jest.fn(),
    logout: jest.fn(),
    updateUser: jest.fn(),
  }),
}));

jest.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: () => null,
  }),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    mockLogin.mockReset();
  });

  it("renders email and password fields and submit button", () => {
    render(<LoginForm />);

    expect(
      screen.getByLabelText(/Email/i)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Password/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^Sign in$/i })
    ).toBeInTheDocument();
  });

  it("calls login with form values when submitted", async () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /^Sign in$/i })
    );

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(
        "test@example.com",
        "password123",
        false
      );
    });
  });
});

