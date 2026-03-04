"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminMovieService = void 0;
const movie_repository_1 = require("../../repositories/movie.repository");
const http_error_1 = require("../../errors/http-error");
const movieRepository = new movie_repository_1.MovieRepository();
class AdminMovieService {
    async create(data) {
        const payload = {
            title: data.title,
            description: data.description,
            genre: data.genre ?? [],
            duration: data.duration,
            rating: data.rating,
        };
        if (data.posterUrl)
            payload.posterUrl = data.posterUrl;
        if (data.releaseDate)
            payload.releaseDate = new Date(data.releaseDate);
        if (data.language)
            payload.language = data.language;
        return movieRepository.create(payload);
    }
    async getOne(id) {
        const movie = await movieRepository.findById(id);
        if (!movie)
            throw new http_error_1.HttpError(404, "Movie not found");
        return movie;
    }
    async getPaginated(pagination) {
        const { page, limit } = pagination;
        const skip = (page - 1) * limit;
        const { movies, total } = await movieRepository.findPaginated(skip, limit);
        const totalPages = Math.ceil(total / limit);
        return { data: movies, total, page, limit, totalPages };
    }
    async update(id, data) {
        const movie = await movieRepository.findById(id);
        if (!movie)
            throw new http_error_1.HttpError(404, "Movie not found");
        const payload = { ...data };
        if (data.releaseDate !== undefined) {
            payload.releaseDate = data.releaseDate ? new Date(data.releaseDate) : undefined;
        }
        const updated = await movieRepository.update(id, payload);
        if (!updated)
            throw new http_error_1.HttpError(500, "Failed to update movie");
        return updated;
    }
    async delete(id) {
        const movie = await movieRepository.findById(id);
        if (!movie)
            throw new http_error_1.HttpError(404, "Movie not found");
        const ok = await movieRepository.delete(id);
        if (!ok)
            throw new http_error_1.HttpError(500, "Failed to delete movie");
        return true;
    }
}
exports.AdminMovieService = AdminMovieService;
