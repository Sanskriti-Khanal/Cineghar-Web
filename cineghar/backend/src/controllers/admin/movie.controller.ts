import { Request, Response } from "express";
import { AdminMovieService } from "../../services/admin/movie.service";
import { CreateMovieDto, UpdateMovieDto } from "../../dtos/movie.dto";
import { PaginationDto } from "../../dtos/pagination.dto";
import z from "zod";

const adminMovieService = new AdminMovieService();

function buildMovieBody(body: Record<string, unknown>, file?: Express.Multer.File) {
  const genreRaw = body.genre;
  const genre = Array.isArray(genreRaw)
    ? genreRaw
    : typeof genreRaw === "string"
      ? genreRaw.split(",").map((s: string) => s.trim()).filter(Boolean)
      : [];
  const posterUrl = file ? `/uploads/${file.filename}` : (body.posterUrl as string | undefined);
  return {
    title: String(body.title ?? ""),
    description: String(body.description ?? ""),
    genre,
    duration: Number(body.duration) || 0,
    rating: Number(body.rating) ?? 0,
    posterUrl: posterUrl || (body.posterUrl as string | undefined) || undefined,
    releaseDate: body.releaseDate ? String(body.releaseDate) : undefined,
    language: body.language ? String(body.language) : undefined,
  };
}

export class AdminMovieController {
  async create(req: Request, res: Response) {
    try {
      const body = buildMovieBody(req.body as Record<string, unknown>, req.file);
      const parsed = CreateMovieDto.safeParse(body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsed.error),
        });
      }
      const movie = await adminMovieService.create(parsed.data);
      return res.status(201).json({
        success: true,
        message: "Movie created successfully",
        data: movie,
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
      const movie = await adminMovieService.getOne(id);
      return res.status(200).json({
        success: true,
        data: movie,
        message: "Movie fetched",
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const parsed = PaginationDto.safeParse(req.query);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsed.error),
        });
      }
      const result = await adminMovieService.getPaginated(parsed.data);
      return res.status(200).json({
        success: true,
        data: result.data,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        totalMovies: result.total,
        message: "Movies fetched successfully",
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const body = buildMovieBody(req.body as Record<string, unknown>, req.file);
      const parsed = UpdateMovieDto.safeParse(body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsed.error),
        });
      }
      const movie = await adminMovieService.update(id, parsed.data);
      return res.status(200).json({
        success: true,
        data: movie,
        message: "Movie updated successfully",
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      await adminMovieService.delete(id);
      return res.status(200).json({
        success: true,
        message: "Movie deleted successfully",
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}
