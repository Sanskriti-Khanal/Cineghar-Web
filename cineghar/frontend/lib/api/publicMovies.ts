import axios from "./axios";
import { API } from "./endpoints";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5050";

export interface CinegharMovie {
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

interface ListResponse {
  success: boolean;
  data: CinegharMovie[];
  page: number;
  limit: number;
  totalPages: number;
  total: number;
}

interface DetailResponse {
  success: boolean;
  data: CinegharMovie;
}

export const getMoviesApi = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const { data } = await axios.get<ListResponse>(API.MOVIES, {
    params: params ?? {},
  });
  return data;
};

export const getMovieByIdApi = async (id: string) => {
  const { data } = await axios.get<DetailResponse>(API.MOVIE_BY_ID(id));
  return data;
};

/**
 * Returns full URL for a movie poster (uploaded path or external URL).
 */
export const getPosterUrl = (posterUrl: string | undefined): string | null => {
  if (!posterUrl) return null;
  if (posterUrl.startsWith("http")) return posterUrl;
  return `${API_BASE}${posterUrl}`;
};
