"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieRepository = void 0;
const movie_model_1 = require("../models/movie.model");
class MovieRepository {
    async create(data) {
        const movie = new movie_model_1.MovieModel(data);
        await movie.save();
        return movie;
    }
    async findById(id) {
        return movie_model_1.MovieModel.findById(id).lean();
    }
    async findPaginated(skip, limit, search) {
        const filter = search?.trim()
            ? { title: { $regex: search.trim(), $options: "i" } }
            : {};
        const [movies, total] = await Promise.all([
            movie_model_1.MovieModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            movie_model_1.MovieModel.countDocuments(filter),
        ]);
        return { movies: movies, total };
    }
    async update(id, data) {
        return movie_model_1.MovieModel.findByIdAndUpdate(id, data, { new: true }).lean();
    }
    async delete(id) {
        const result = await movie_model_1.MovieModel.findByIdAndDelete(id);
        return !!result;
    }
}
exports.MovieRepository = MovieRepository;
