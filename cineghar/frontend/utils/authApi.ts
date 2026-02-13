import { api } from "./api";
import { API_ENDPOINTS } from "./constants";

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  dateOfBirth?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  token?: string;
}

export const registerUserApi = async (params: {
  name: string;
  email: string;
  password: string;
  dateOfBirth?: string;
}) => {
  const { data } = await api.post<ApiResponse<AuthUser>>(
    API_ENDPOINTS.AUTH.REGISTER,
    {
      name: params.name,
      email: params.email,
      password: params.password,
      dateOfBirth: params.dateOfBirth,
      confirmPassword: params.password,
    }
  );
  return data;
};

export const loginUserApi = async (params: {
  email: string;
  password: string;
}) => {
  const { data } = await api.post<ApiResponse<AuthUser>>(
    API_ENDPOINTS.AUTH.LOGIN,
    {
      email: params.email,
      password: params.password,
    }
  );

  if (!data.token) {
    throw new Error("Token missing in response");
  }

  return {
    user: data.data,
    token: data.token,
    message: data.message,
  };
};

