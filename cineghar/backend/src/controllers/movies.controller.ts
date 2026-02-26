import { Request, Response } from "express";
import { MovieRepository } from "../repositories/movie.repository";
import { HttpError } from "../errors/http-error";

const movieRepository = new MovieRepository();

export class MoviesController {
  async list(req: Request, res: Response) {
    try {
      const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
      const page = Math.max(Number(req.query.page) || 1, 1);
      const search = typeof req.query.search === "string" ? req.query.search : undefined;
      const skip = (page - 1) * limit;
      const { movies, total } = await movieRepository.findPaginated(skip, limit, search);
      const totalPages = Math.ceil(total / limit);
      return res.status(200).json({
        success: true,
        data: movies,
        page,
        limit,
        totalPages,
        total,
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const movie = await movieRepository.findById(id);
      if (!movie) throw new HttpError(404, "Movie not found");
      return res.status(200).json({
        success: true,
        data: movie,
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}
