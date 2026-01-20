import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5050/api";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ??
      error?.message ??
      "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  }
);

