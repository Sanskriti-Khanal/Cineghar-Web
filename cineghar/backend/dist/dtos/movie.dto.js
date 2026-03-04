"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMovieDto = exports.CreateMovieDto = void 0;
const zod_1 = __importDefault(require("zod"));
exports.CreateMovieDto = zod_1.default.object({
    title: zod_1.default.string().min(1, "Title is required"),
    description: zod_1.default.string().min(1, "Description is required"),
    genre: zod_1.default.array(zod_1.default.string()).default([]),
    duration: zod_1.default.coerce.number().int().min(1, "Duration must be at least 1 minute"),
    rating: zod_1.default.coerce.number().min(0).max(10),
    posterUrl: zod_1.default.union([zod_1.default.string().url(), zod_1.default.string().startsWith("/")]).optional().or(zod_1.default.literal("")),
    releaseDate: zod_1.default.string().optional(),
    language: zod_1.default.string().optional(),
});
exports.UpdateMovieDto = zod_1.default.object({
    title: zod_1.default.string().min(1).optional(),
    description: zod_1.default.string().min(1).optional(),
    genre: zod_1.default.array(zod_1.default.string()).optional(),
    duration: zod_1.default.coerce.number().int().min(1).optional(),
    rating: zod_1.default.coerce.number().min(0).max(10).optional(),
    posterUrl: zod_1.default.union([zod_1.default.string().url(), zod_1.default.string().startsWith("/")]).optional().or(zod_1.default.literal("")),
    releaseDate: zod_1.default.string().optional(),
    language: zod_1.default.string().optional(),
});
