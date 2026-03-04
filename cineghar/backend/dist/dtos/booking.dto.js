"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateShowtimeDto = exports.CreateShowtimeDto = exports.UpdateCinemaHallDto = exports.CreateCinemaHallDto = void 0;
const zod_1 = __importDefault(require("zod"));
exports.CreateCinemaHallDto = zod_1.default.object({
    name: zod_1.default.string().min(1, "Name is required"),
    city: zod_1.default.custom().refine((val) => ["Kathmandu", "Pokhara", "Chitwan"].includes(String(val)), { message: "Invalid city" }),
    location: zod_1.default.string().min(1, "Location is required"),
    rating: zod_1.default.coerce.number().min(0).max(5).optional(),
    facilities: zod_1.default.array(zod_1.default.string()).optional().default([]),
    isActive: zod_1.default.boolean().optional().default(true),
});
exports.UpdateCinemaHallDto = exports.CreateCinemaHallDto.partial();
exports.CreateShowtimeDto = zod_1.default.object({
    movieId: zod_1.default.string().min(1, "movieId is required"),
    hallId: zod_1.default.string().min(1, "hallId is required"),
    startTime: zod_1.default.string().min(1, "startTime is required"),
    isActive: zod_1.default.boolean().optional().default(true),
});
exports.UpdateShowtimeDto = exports.CreateShowtimeDto.partial();
