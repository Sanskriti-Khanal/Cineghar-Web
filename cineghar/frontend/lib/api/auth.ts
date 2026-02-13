import axios from "./axios";
import { API } from "./endpoints";

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  dateOfBirth?: string;
  imageUrl?: string;
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
  const { data } = await axios.post<ApiResponse<AuthUser>>(
    API.AUTH.REGISTER,
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
  const { data } = await axios.post<ApiResponse<AuthUser>>(
    API.AUTH.LOGIN,
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

export const getProfileApi = async () => {
  const { data } = await axios.get<ApiResponse<AuthUser>>(API.AUTH.WHOAMI);
  return data;
};

export const updateProfileApi = async (formData: FormData) => {
  const { data } = await axios.put<ApiResponse<AuthUser>>(
    API.AUTH.UPDATE_PROFILE,
    formData
  );
  return data;
};

export const updateUserByIdApi = async (id: string, formData: FormData) => {
  const { data } = await axios.put<ApiResponse<AuthUser>>(
    API.AUTH.UPDATE_BY_ID(id),
    formData
  );
  return data;
};

export const forgotPasswordApi = async (email: string) => {
  const { data } = await axios.post<ApiResponse<unknown>>(
    API.AUTH.FORGOT_PASSWORD,
    { email }
  );
  return data;
};

export const resetPasswordApi = async (params: {
  token: string;
  password: string;
  confirmPassword: string;
}) => {
  const { data } = await axios.post<ApiResponse<unknown>>(
    API.AUTH.RESET_PASSWORD,
    {
      token: params.token,
      password: params.password,
      confirmPassword: params.confirmPassword,
    }
  );
  return data;
};

