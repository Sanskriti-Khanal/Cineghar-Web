import axios from "axios";
import {
  TMDB_API_KEY,
  TMDB_ACCESS_TOKEN,
  TMDB_BASE_URL,
  TMDB_IMAGE_BASE_URL,
} from "../configs";
import { HttpError } from "../errors/http-error";

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

class MovieService {
  private axiosInstance = axios.create({
    baseURL: TMDB_BASE_URL,
    headers: {
      Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
      Accept: "application/json",
    },
    params: {
      api_key: TMDB_API_KEY,
    },
  });

  /**
   * Get popular movies
   */
  async getPopularMovies(page: number = 1): Promise<MoviesResponse> {
    try {
      const response = await this.axiosInstance.get("/movie/popular", {
        params: { page },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Failed to fetch popular movies: ${error.response?.data?.status_message || error.message}`
      );
    }
  }

  /**
   * Get tomorrow's date in YYYY-MM-DD format
   */
  private getTomorrowDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  }

  /**
   * Get movie release dates for a specific region
   */
  private async getMovieReleaseDates(movieId: number, region: string = "NP"): Promise<{
    release_date: string | null;
    status: string;
    theater_available: boolean;
  }> {
    try {
      const response = await this.axiosInstance.get(`/movie/${movieId}/release_dates`);
      const releaseDates = response.data.results || [];
      
      // Find Nepal-specific release date
      const nepalRelease = releaseDates.find((rd: any) => rd.iso_3166_1 === region);
      
      if (nepalRelease && nepalRelease.release_dates && nepalRelease.release_dates.length > 0) {
        // Find theatrical release (type 2 = Premiere, type 3 = Limited Theatrical, type 1 = Premiere)
        const theatricalRelease = nepalRelease.release_dates.find(
          (rd: any) => rd.type === 2 || rd.type === 3 || rd.type === 1
        );
        
        if (theatricalRelease) {
          return {
            release_date: theatricalRelease.release_date || null,
            status: theatricalRelease.type === 2 ? "Premiere" : theatricalRelease.type === 3 ? "Limited" : "Premiere",
            theater_available: true,
          };
        }
      }
      
      // Fallback: check if any release date exists
      const anyRelease = releaseDates.find((rd: any) => 
        rd.release_dates && rd.release_dates.length > 0
      );
      
      if (anyRelease && anyRelease.release_dates && anyRelease.release_dates.length > 0) {
        const firstRelease = anyRelease.release_dates[0];
        return {
          release_date: firstRelease.release_date || null,
          status: "TBA",
          theater_available: false,
        };
      }
      
      return {
        release_date: null,
        status: "TBA",
        theater_available: false,
      };
    } catch (error: any) {
      console.error(`Failed to fetch release dates for movie ${movieId}:`, error.message);
      return {
        release_date: null,
        status: "TBA",
        theater_available: false,
      };
    }
  }

  /**
   * Get upcoming movies releasing in theaters across all languages
   * Uses discover endpoint with filters for truly upcoming movies
   */
  async getUpcomingMovies(page: number = 1, region: string = "NP"): Promise<MoviesResponse> {
    try {
      // Validate API credentials
      if (!TMDB_API_KEY || !TMDB_ACCESS_TOKEN) {
        throw new Error("TMDB API credentials are not configured");
      }

      const tomorrow = this.getTomorrowDate();
      console.log(`Fetching upcoming movies from ${tomorrow} for region ${region}`);

      // Try discover endpoint first (more reliable for upcoming movies)
      let response;
      try {
        const discoverParams: any = {
          page,
          "primary_release_date.gte": tomorrow,
          with_release_type: "2|3", // 2 = Premiere, 3 = Limited Theatrical
          region: region,
          language: "en", // Primary language
          include_adult: false,
          sort_by: "primary_release_date.asc",
        };

        response = await this.axiosInstance.get("/discover/movie", {
          params: discoverParams,
        });

        // If discover returns empty or few results, fallback to upcoming endpoint
        if (!response.data.results || response.data.results.length < 5) {
          console.log("Discover returned few results, trying upcoming endpoint...");
          const upcomingParams: any = {
            page,
            "primary_release_date.gte": tomorrow,
            region: region,
            language: "en",
            include_adult: false,
          };

          response = await this.axiosInstance.get("/movie/upcoming", {
            params: upcomingParams,
          });
        }
      } catch (discoverError: any) {
        console.error("Discover endpoint failed, trying upcoming endpoint:", discoverError.message);
        // Fallback to upcoming endpoint
        const upcomingParams: any = {
          page,
          region: region,
          language: "en",
          include_adult: false,
        };

        response = await this.axiosInstance.get("/movie/upcoming", {
          params: upcomingParams,
        });
      }

      // Filter movies to only include those with future release dates
      const allMovies = response.data.results || [];
      const tomorrowDate = new Date(tomorrow);
      
      const filteredMovies = allMovies.filter((movie: any) => {
        if (!movie.release_date) return false;
        const releaseDate = new Date(movie.release_date);
        return releaseDate >= tomorrowDate;
      });

      // Fetch release dates for each movie (limit to first 20 to avoid rate limits)
      // Add small delay between requests to avoid rate limiting
      const moviesWithReleaseInfo = await Promise.all(
        filteredMovies.slice(0, 20).map(async (movie: any, index: number) => {
          // Add delay to avoid rate limiting (50ms between requests)
          if (index > 0) {
            await new Promise(resolve => setTimeout(resolve, 50));
          }
          
          const releaseInfo = await this.getMovieReleaseDates(movie.id, region);
          
          return {
            ...movie,
            release_status: releaseInfo.status,
            theater_release_date: releaseInfo.release_date || movie.release_date,
            theater_available: releaseInfo.theater_available,
          };
        })
      );

      // Add remaining movies without release info
      const remainingMovies = filteredMovies.slice(20).map((movie: any) => ({
        ...movie,
        release_status: movie.release_date ? "Scheduled" : "TBA",
        theater_release_date: movie.release_date,
        theater_available: true,
      }));

      const finalMovies = [...moviesWithReleaseInfo, ...remainingMovies];

      console.log(`Found ${finalMovies.length} upcoming movies`);

      return {
        page: response.data.page || page,
        results: finalMovies,
        total_pages: response.data.total_pages || 1,
        total_results: finalMovies.length,
      };
    } catch (error: any) {
      console.error("Error fetching upcoming movies:", error);
      
      // Handle specific API errors
      if (error.response?.status === 401) {
        throw new Error("Invalid TMDB API credentials. Please check your API key and access token.");
      }
      if (error.response?.status === 429) {
        throw new Error("TMDB API rate limit exceeded. Please try again later.");
      }
      
      throw new Error(
        `Failed to fetch upcoming movies: ${error.response?.data?.status_message || error.message}`
      );
    }
  }

  /**
   * Search movies
   */
  async searchMovies(query: string, page: number = 1): Promise<MoviesResponse> {
    try {
      const response = await this.axiosInstance.get("/search/movie", {
        params: { query, page },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Failed to search movies: ${error.response?.data?.status_message || error.message}`
      );
    }
  }

  /**
   * Get movie details by ID
   */
  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    try {
      const response = await this.axiosInstance.get(`/movie/${movieId}`);
      return response.data;
    } catch (error: any) {
      const status = error.response?.status;
      const message = error.response?.data?.status_message || error.message;
      if (status === 404 || (message && message.toLowerCase().includes("could not be found"))) {
        throw new HttpError(404, "Movie not found");
      }
      throw new HttpError(status || 500, message || "Failed to fetch movie details");
    }
  }

  /**
   * Get image URL helper
   */
  getImageUrl(path: string | null, size: string = "w500"): string | null {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }
}

export const movieService = new MovieService();
