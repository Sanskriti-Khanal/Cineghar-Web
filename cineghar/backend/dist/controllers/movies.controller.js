"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoviesController = void 0;
const movie_repository_1 = require("../repositories/movie.repository");
const http_error_1 = require("../errors/http-error");
const movieRepository = new movie_repository_1.MovieRepository();
class MoviesController {
    async list(req, res) {
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
            const movie = await movieRepository.findById(id);
            if (!movie)
                throw new http_error_1.HttpError(404, "Movie not found");
            return res.status(200).json({
                success: true,
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
}
exports.MoviesController = MoviesController;
