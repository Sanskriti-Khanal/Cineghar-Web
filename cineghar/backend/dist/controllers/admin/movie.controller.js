"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminMovieController = void 0;
const movie_service_1 = require("../../services/admin/movie.service");
const movie_dto_1 = require("../../dtos/movie.dto");
const pagination_dto_1 = require("../../dtos/pagination.dto");
const zod_1 = __importDefault(require("zod"));
const adminMovieService = new movie_service_1.AdminMovieService();
function buildMovieBody(body, file) {
    const genreRaw = body.genre;
    const genre = Array.isArray(genreRaw)
        ? genreRaw
        : typeof genreRaw === "string"
            ? genreRaw.split(",").map((s) => s.trim()).filter(Boolean)
            : [];
    const posterUrl = file ? `/uploads/${file.filename}` : body.posterUrl;
    return {
        title: String(body.title ?? ""),
        description: String(body.description ?? ""),
        genre,
        duration: Number(body.duration) || 0,
        rating: Number(body.rating) ?? 0,
        posterUrl: posterUrl || body.posterUrl || undefined,
        releaseDate: body.releaseDate ? String(body.releaseDate) : undefined,
        language: body.language ? String(body.language) : undefined,
    };
}
class AdminMovieController {
    async create(req, res) {
        try {
            const body = buildMovieBody(req.body, req.file);
            const parsed = movie_dto_1.CreateMovieDto.safeParse(body);
            if (!parsed.success) {
                return res.status(400).json({
                    success: false,
                    message: zod_1.default.prettifyError(parsed.error),
                });
            }
            const movie = await adminMovieService.create(parsed.data);
            return res.status(201).json({
                success: true,
                message: "Movie created successfully",
                data: movie,
            });
        }
        catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
    async getOne(req, res) {
        try {
            const id = String(req.params.id);
            const movie = await adminMovieService.getOne(id);
            return res.status(200).json({
                success: true,
                data: movie,
                message: "Movie fetched",
            });
        }
        catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
    async getAll(req, res) {
        try {
            const parsed = pagination_dto_1.PaginationDto.safeParse(req.query);
            if (!parsed.success) {
                return res.status(400).json({
                    success: false,
                    message: zod_1.default.prettifyError(parsed.error),
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
        }
        catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
    async update(req, res) {
        try {
            const id = String(req.params.id);
            const body = buildMovieBody(req.body, req.file);
            const parsed = movie_dto_1.UpdateMovieDto.safeParse(body);
            if (!parsed.success) {
                return res.status(400).json({
                    success: false,
                    message: zod_1.default.prettifyError(parsed.error),
                });
            }
            const movie = await adminMovieService.update(id, parsed.data);
            return res.status(200).json({
                success: true,
                data: movie,
                message: "Movie updated successfully",
            });
        }
        catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
    async delete(req, res) {
        try {
            const id = String(req.params.id);
            await adminMovieService.delete(id);
            return res.status(200).json({
                success: true,
                message: "Movie deleted successfully",
            });
        }
        catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
}
exports.AdminMovieController = AdminMovieController;
