"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminShowtimeController = exports.AdminCinemaHallController = void 0;
const cinema_hall_model_1 = require("../../models/cinema-hall.model");
const showtime_model_1 = require("../../models/showtime.model");
const booking_dto_1 = require("../../dtos/booking.dto");
const pagination_dto_1 = require("../../dtos/pagination.dto");
const zod_1 = __importDefault(require("zod"));
const http_error_1 = require("../../errors/http-error");
class AdminCinemaHallController {
    async create(req, res) {
        try {
            const parsed = booking_dto_1.CreateCinemaHallDto.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    success: false,
                    message: zod_1.default.prettifyError(parsed.error),
                });
            }
            const hall = await cinema_hall_model_1.CinemaHallModel.create(parsed.data);
            return res.status(201).json({
                success: true,
                message: "Cinema hall created",
                data: hall,
            });
        }
        catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
    async list(req, res) {
        try {
            const parsed = pagination_dto_1.PaginationDto.safeParse(req.query);
            if (!parsed.success) {
                return res.status(400).json({
                    success: false,
                    message: zod_1.default.prettifyError(parsed.error),
                });
            }
            const { page, limit } = parsed.data;
            const skip = (page - 1) * limit;
            const [halls, total] = await Promise.all([
                cinema_hall_model_1.CinemaHallModel.find().skip(skip).limit(limit).lean(),
                cinema_hall_model_1.CinemaHallModel.countDocuments(),
            ]);
            const totalPages = Math.ceil(total / limit);
            return res.status(200).json({
                success: true,
                data: halls,
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
            const hall = await cinema_hall_model_1.CinemaHallModel.findById(id).lean();
            if (!hall)
                throw new http_error_1.HttpError(404, "Cinema hall not found");
            return res.status(200).json({
                success: true,
                data: hall,
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
            const parsed = booking_dto_1.UpdateCinemaHallDto.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    success: false,
                    message: zod_1.default.prettifyError(parsed.error),
                });
            }
            const hall = await cinema_hall_model_1.CinemaHallModel.findByIdAndUpdate(id, parsed.data, {
                new: true,
            }).lean();
            if (!hall)
                throw new http_error_1.HttpError(404, "Cinema hall not found");
            return res.status(200).json({
                success: true,
                message: "Cinema hall updated",
                data: hall,
            });
        }
        catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
    async remove(req, res) {
        try {
            const id = String(req.params.id);
            const deleted = await cinema_hall_model_1.CinemaHallModel.findByIdAndDelete(id).lean();
            if (!deleted)
                throw new http_error_1.HttpError(404, "Cinema hall not found");
            return res.status(200).json({
                success: true,
                message: "Cinema hall deleted",
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
exports.AdminCinemaHallController = AdminCinemaHallController;
class AdminShowtimeController {
    async create(req, res) {
        try {
            const parsed = booking_dto_1.CreateShowtimeDto.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    success: false,
                    message: zod_1.default.prettifyError(parsed.error),
                });
            }
            const data = parsed.data;
            const startTime = new Date(data.startTime);
            const showtime = await showtime_model_1.ShowtimeModel.create({
                movie: data.movieId,
                hall: data.hallId,
                startTime,
                isActive: data.isActive ?? true,
            });
            return res.status(201).json({
                success: true,
                message: "Showtime created",
                data: showtime,
            });
        }
        catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
    async list(req, res) {
        try {
            const parsed = pagination_dto_1.PaginationDto.safeParse(req.query);
            if (!parsed.success) {
                return res.status(400).json({
                    success: false,
                    message: zod_1.default.prettifyError(parsed.error),
                });
            }
            const { page, limit } = parsed.data;
            const skip = (page - 1) * limit;
            const [showtimes, total] = await Promise.all([
                showtime_model_1.ShowtimeModel.find()
                    .populate("movie")
                    .populate("hall")
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                showtime_model_1.ShowtimeModel.countDocuments(),
            ]);
            const totalPages = Math.ceil(total / limit);
            return res.status(200).json({
                success: true,
                data: showtimes,
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
            const showtime = await showtime_model_1.ShowtimeModel.findById(id)
                .populate("movie")
                .populate("hall")
                .lean();
            if (!showtime)
                throw new http_error_1.HttpError(404, "Showtime not found");
            return res.status(200).json({
                success: true,
                data: showtime,
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
            const parsed = booking_dto_1.UpdateShowtimeDto.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    success: false,
                    message: zod_1.default.prettifyError(parsed.error),
                });
            }
            const data = parsed.data;
            const update = {};
            if (data.movieId)
                update.movie = data.movieId;
            if (data.hallId)
                update.hall = data.hallId;
            if (data.startTime)
                update.startTime = new Date(data.startTime);
            if (data.isActive !== undefined)
                update.isActive = data.isActive;
            const showtime = await showtime_model_1.ShowtimeModel.findByIdAndUpdate(id, update, {
                new: true,
            })
                .populate("movie")
                .populate("hall")
                .lean();
            if (!showtime)
                throw new http_error_1.HttpError(404, "Showtime not found");
            return res.status(200).json({
                success: true,
                message: "Showtime updated",
                data: showtime,
            });
        }
        catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
    async remove(req, res) {
        try {
            const id = String(req.params.id);
            const deleted = await showtime_model_1.ShowtimeModel.findByIdAndDelete(id).lean();
            if (!deleted)
                throw new http_error_1.HttpError(404, "Showtime not found");
            return res.status(200).json({
                success: true,
                message: "Showtime deleted",
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
exports.AdminShowtimeController = AdminShowtimeController;
