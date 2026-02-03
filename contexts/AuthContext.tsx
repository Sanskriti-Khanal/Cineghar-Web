"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/utils/constants";
import { type AuthUser } from "@/lib/api/auth";
import {
  clearAuthCookies,
  getAuthToken,
  getUserData,
  setUserData,
} from "@/lib/cookie";
import { handleLogin, handleRegister } from "@/lib/actions/auth-action";

interface User {
  email: string;
  name?: string;
  role?: "user" | "admin";
   dateOfBirth?: string;
  imageUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    dateOfBirth?: string
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapAuthUserToUser(authUser: AuthUser): User {
  return {
    email: authUser.email,
    name: authUser.name,
    role: authUser.role,
    dateOfBirth: authUser.dateOfBirth,
    imageUrl: authUser.imageUrl,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      try {
        const token = await getAuthToken();
        const cookieUser = await getUserData();

        if (token && cookieUser) {
          setUser(mapAuthUserToUser(cookieUser as AuthUser));
        }
      } finally {
        setIsLoading(false);
      }
    };

    void init();
  }, []);

  const login = async (
    email: string,
    password: string,
    rememberMe: boolean = false
  ) => {
    setIsLoading(true);
    try {
      const result = await handleLogin({ email, password, rememberMe });

      if (!result.success) {
        throw new Error(result.message);
      }

      const authUser = result.data as AuthUser;
      setUser(mapAuthUserToUser(authUser));

      if (authUser.role === "admin") {
        router.push(ROUTES.ADMIN_DASHBOARD);
      } else {
        router.push(ROUTES.DASHBOARD);
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    dateOfBirth?: string
  ) => {
    setIsLoading(true);
    try {
      const result = await handleRegister({
        name,
        email,
        password,
        dateOfBirth,
      });

      if (!result.success) {
        throw new Error(result.message);
      }

      // Auto-login after successful registration
      await login(email, password, true);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    void clearAuthCookies();
    router.push(ROUTES.LOGIN);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    // Persist updated user in cookies so it is available on reload
    void setUserData(
      {
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        dateOfBirth: updatedUser.dateOfBirth,
        imageUrl: updatedUser.imageUrl,
      },
      true
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

