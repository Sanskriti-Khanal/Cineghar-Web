import axios from "./axios";
import { API } from "./endpoints";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface AdminCinemaHall {
  _id: string;
  name: string;
  city: "Kathmandu" | "Pokhara" | "Chitwan";
  location: string;
  rating?: number;
  facilities?: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminShowtime {
  _id: string;
  movie: string | { _id: string; title: string };
  hall: string | { _id: string; name: string; city: string };
  startTime: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T;
  page?: number;
  limit?: number;
  totalPages?: number;
  total?: number;
}

// Halls
export const getAdminHallsApi = async (params?: PaginationParams) => {
  const { data } = await axios.get<PaginatedResponse<AdminCinemaHall[]>>(
    API.ADMIN.HALLS,
    { params: params ?? {} }
  );
  return data;
};

export const getAdminHallByIdApi = async (id: string) => {
  const { data } = await axios.get<ApiResponse<AdminCinemaHall>>(
    API.ADMIN.HALL_BY_ID(id)
  );
  return data;
};

export const createAdminHallApi = async (
  payload: Partial<AdminCinemaHall> & {
    name: string;
    city: AdminCinemaHall["city"];
    location: string;
  }
) => {
  const { data } = await axios.post<ApiResponse<AdminCinemaHall>>(
    API.ADMIN.HALLS,
    payload
  );
  return data;
};

export const updateAdminHallApi = async (
  id: string,
  payload: Partial<AdminCinemaHall>
) => {
  const { data } = await axios.put<ApiResponse<AdminCinemaHall>>(
    API.ADMIN.HALL_BY_ID(id),
    payload
  );
  return data;
};

export const deleteAdminHallApi = async (id: string) => {
  const { data } = await axios.delete<ApiResponse<unknown>>(
    API.ADMIN.HALL_BY_ID(id)
  );
  return data;
};

// Showtimes
export const getAdminShowtimesApi = async (params?: PaginationParams) => {
  const { data } = await axios.get<PaginatedResponse<AdminShowtime[]>>(
    API.ADMIN.SHOWTIMES,
    { params: params ?? {} }
  );
  return data;
};

export const getAdminShowtimeByIdApi = async (id: string) => {
  const { data } = await axios.get<ApiResponse<AdminShowtime>>(
    API.ADMIN.SHOWTIME_BY_ID(id)
  );
  return data;
};

export const createAdminShowtimeApi = async (payload: {
  movieId: string;
  hallId: string;
  startTime: string;
  isActive?: boolean;
}) => {
  const { data } = await axios.post<ApiResponse<AdminShowtime>>(
    API.ADMIN.SHOWTIMES,
    payload
  );
  return data;
};

export const updateAdminShowtimeApi = async (
  id: string,
  payload: Partial<{
    movieId: string;
    hallId: string;
    startTime: string;
    isActive?: boolean;
  }>
) => {
  const { data } = await axios.put<ApiResponse<AdminShowtime>>(
    API.ADMIN.SHOWTIME_BY_ID(id),
    payload
  );
  return data;
};

export const deleteAdminShowtimeApi = async (id: string) => {
  const { data } = await axios.delete<ApiResponse<unknown>>(
    API.ADMIN.SHOWTIME_BY_ID(id)
  );
  return data;
};

