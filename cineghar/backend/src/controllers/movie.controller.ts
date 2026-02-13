import { Request, Response } from "express";
import { movieService } from "../services/movie.service";

export class MovieController {
  /**
   * Get popular movies
   * GET /api/movies/popular?page=1
   */
  async getPopularMovies(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const movies = await movieService.getPopularMovies(page);
      return res.status(200).json({
        success: true,
        data: movies,
        message: "Popular movies fetched successfully",
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to fetch popular movies",
      });
    }
  }

  /**
   * Get upcoming movies releasing in theaters across all languages
   * GET /api/movies/upcoming?page=1&region=NP (defaults to NP for Nepal)
   */
  async getUpcomingMovies(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const region = (req.query.region as string) || "NP"; // Default to Nepal
      const movies = await movieService.getUpcomingMovies(page, region);
      return res.status(200).json({
        success: true,
        data: movies,
        message: `Upcoming movies in theaters for region ${region} fetched successfully`,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to fetch upcoming movies",
      });
    }
  }

  /**
   * Search movies
   * GET /api/movies/search?query=batman&page=1
   */
  async searchMovies(req: Request, res: Response) {
    try {
      const query = req.query.query as string;
      const page = parseInt(req.query.page as string) || 1;

      if (!query || query.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Query parameter is required",
        });
      }

      const movies = await movieService.searchMovies(query, page);
      return res.status(200).json({
        success: true,
        data: movies,
        message: "Movies searched successfully",
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to search movies",
      });
    }
  }

  /**
   * Get movie details
   * GET /api/movies/:id
   */
  async getMovieDetails(req: Request, res: Response) {
    try {
      const movieId = parseInt(req.params.id);
      if (isNaN(movieId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid movie ID",
        });
      }

      const movie = await movieService.getMovieDetails(movieId);
      return res.status(200).json({
        success: true,
        data: movie,
        message: "Movie details fetched successfully",
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Failed to fetch movie details";
      return res.status(statusCode).json({
        success: false,
        message: statusCode === 404 ? "Movie not found" : message,
      });
    }
  }
}
