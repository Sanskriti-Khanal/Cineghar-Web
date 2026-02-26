import axiosInstance from "./axios";

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids?: number[];
  release_status?: string;
  theater_release_date?: string;
  theater_available?: boolean;
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[];
  runtime: number;
  budget: number;
  revenue: number;
  production_companies: { id: number; name: string; logo_path: string | null }[];
  spoken_languages: { english_name: string }[];
  status: string;
}

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export const moviesApi = {
  /**
   * Get popular movies
   */
  getPopularMovies: async (page: number = 1): Promise<MoviesResponse> => {
    const response = await axiosInstance.get("/api/movies/popular", {
      params: { page },
    });
    return response.data.data;
  },

  /**
   * Get upcoming movies
   */
  getUpcomingMovies: async (page: number = 1): Promise<MoviesResponse> => {
    const response = await axiosInstance.get("/api/movies/upcoming", {
      params: { page },
    });
    return response.data.data;
  },

  /**
   * Search movies
   */
  searchMovies: async (query: string, page: number = 1): Promise<MoviesResponse> => {
    const response = await axiosInstance.get("/api/movies/search", {
      params: { query, page },
    });
    return response.data.data;
  },

  /**
   * Get movie details
   */
  getMovieDetails: async (movieId: number): Promise<MovieDetails> => {
    const response = await axiosInstance.get(`/api/movies/${movieId}`);
    return response.data.data;
  },
};

/**
 * Get TMDB image URL
 * Returns null if no path, so we can conditionally render
 */
export const getImageUrl = (path: string | null, size: string = "w500"): string | null => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
