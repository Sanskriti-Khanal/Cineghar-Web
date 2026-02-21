import axios from "./axios";
import { API } from "./endpoints";

export interface Movie {
  _id: string;
  title: string;
  description: string;
  genre: string[];
  duration: number;
  rating: number;
  posterUrl?: string;
  releaseDate?: string;
  language?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedMoviesResponse {
  success: boolean;
  message: string;
  data: Movie[];
  page?: number;
  limit?: number;
  totalPages?: number;
  totalMovies?: number;
}

export const getAdminMoviesApi = async (params?: PaginationParams) => {
  const { data } = await axios.get<PaginatedMoviesResponse>(
    API.ADMIN.MOVIES,
    { params: params ?? {} }
  );
  return data;
};

export const getAdminMovieByIdApi = async (id: string) => {
  const { data } = await axios.get<ApiResponse<Movie>>(
    API.ADMIN.MOVIE_BY_ID(id)
  );
  return data;
};

export const createAdminMovieApi = async (formData: FormData) => {
  const { data } = await axios.post<ApiResponse<Movie>>(
    API.ADMIN.MOVIES,
    formData
  );
  return data;
};

export const updateAdminMovieApi = async (id: string, formData: FormData) => {
  const { data } = await axios.put<ApiResponse<Movie>>(
    API.ADMIN.MOVIE_BY_ID(id),
    formData
  );
  return data;
};

export const deleteAdminMovieApi = async (id: string) => {
  const { data } = await axios.delete<ApiResponse<unknown>>(
    API.ADMIN.MOVIE_BY_ID(id)
  );
  return data;
};
