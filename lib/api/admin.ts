import axios from "./axios";
import { API } from "./endpoints";
import type { AuthUser } from "./auth";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getAdminUsersApi = async () => {
  const { data } = await axios.get<ApiResponse<AuthUser[]>>(API.ADMIN.USERS);
  return data;
};

export const getAdminUserByIdApi = async (id: string) => {
  const { data } = await axios.get<ApiResponse<AuthUser>>(
    API.ADMIN.USER_BY_ID(id)
  );
  return data;
};

export const createAdminUserApi = async (formData: FormData) => {
  const { data } = await axios.post<ApiResponse<AuthUser>>(
    API.ADMIN.USERS,
    formData
  );
  return data;
};

export const updateAdminUserApi = async (id: string, formData: FormData) => {
  const { data } = await axios.put<ApiResponse<AuthUser>>(
    API.ADMIN.USER_BY_ID(id),
    formData
  );
  return data;
};

export const deleteAdminUserApi = async (id: string) => {
  const { data } = await axios.delete<ApiResponse<unknown>>(
    API.ADMIN.USER_BY_ID(id)
  );
  return data;
};
