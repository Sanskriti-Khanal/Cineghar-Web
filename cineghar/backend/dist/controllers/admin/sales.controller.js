"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSalesController = void 0;
const zod_1 = __importDefault(require("zod"));
const booking_model_1 = require("../../models/booking.model");
const http_error_1 = require("../../errors/http-error");
const SalesQueryDto = zod_1.default.object({
    from: zod_1.default.string().datetime().optional(),
    to: zod_1.default.string().datetime().optional(),
    groupBy: zod_1.default.enum(["movie", "day"]).optional(),
});
function getDateRange(query) {
    const now = new Date();
    const defaultFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const from = query.from ? new Date(query.from) : defaultFrom;
    const to = query.to ? new Date(query.to) : now;
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
        throw new http_error_1.HttpError(400, "Invalid from/to date");
    }
    if (from > to) {
        throw new http_error_1.HttpError(400, "`from` date cannot be after `to` date");
    }
    return { from, to };
}
class AdminSalesController {
    async summary(req, res) {
        try {
            const parsed = SalesQueryDto.safeParse(req.query);
            if (!parsed.success) {
                return res.status(400).json({
                    success: false,
                    message: zod_1.default.prettifyError(parsed.error),
                });
            }
            const { groupBy } = parsed.data;
            const { from, to } = getDateRange(parsed.data);
            const matchStage = {
                $match: {
                    status: "confirmed",
                    createdAt: { $gte: from, $lte: to },
                },
            };
            if (!groupBy) {
                const [result] = await booking_model_1.BookingModel.aggregate([
                    matchStage,
                    {
                        $group: {
                            _id: null,
                            totalRevenue: { $sum: "$totalPrice" },
                            totalTickets: { $sum: { $size: "$seats" } },
                            totalBookings: { $sum: 1 },
                        },
                    },
                ]);
                return res.status(200).json({
                    success: true,
                    data: {
                        from,
                        to,
                        totalRevenue: result?.totalRevenue || 0,
                        totalTickets: result?.totalTickets || 0,
                        totalBookings: result?.totalBookings || 0,
                    },
                });
            }
            if (groupBy === "day") {
                const results = await booking_model_1.BookingModel.aggregate([
                    matchStage,
                    {
                        $group: {
                            _id: {
                                year: { $year: "$createdAt" },
                                month: { $month: "$createdAt" },
                                day: { $dayOfMonth: "$createdAt" },
                            },
                            totalRevenue: { $sum: "$totalPrice" },
                            totalTickets: { $sum: { $size: "$seats" } },
                            totalBookings: { $sum: 1 },
                        },
                    },
                    {
                        $sort: {
                            "_id.year": 1,
                            "_id.month": 1,
                            "_id.day": 1,
                        },
                    },
                ]);
                const data = results.map((r) => {
                    const date = new Date(r._id.year, r._id.month - 1, r._id.day);
                    return {
                        date,
                        totalRevenue: r.totalRevenue,
                        totalTickets: r.totalTickets,
                        totalBookings: r.totalBookings,
                    };
                });
                return res.status(200).json({
                    success: true,
                    data: {
                        from,
                        to,
                        items: data,
                    },
                });
            }
            // groupBy === "movie"
            const results = await booking_model_1.BookingModel.aggregate([
                matchStage,
                {
                    $lookup: {
                        from: "showtimes",
                        localField: "showtime",
                        foreignField: "_id",
                        as: "showtime",
                    },
                },
                { $unwind: "$showtime" },
                {
                    $lookup: {
                        from: "movies",
                        localField: "showtime.movie",
                        foreignField: "_id",
                        as: "movie",
                    },
                },
                { $unwind: "$movie" },
                {
                    $group: {
                        _id: "$movie._id",
                        movieTitle: { $first: "$movie.title" },
                        totalRevenue: { $sum: "$totalPrice" },
                        totalTickets: { $sum: { $size: "$seats" } },
                        totalBookings: { $sum: 1 },
                    },
                },
                {
                    $sort: {
                        totalRevenue: -1,
                    },
                },
            ]);
            return res.status(200).json({
                success: true,
                data: {
                    from,
                    to,
                    items: results.map((r) => ({
                        movieId: r._id,
                        movieTitle: r.movieTitle,
                        totalRevenue: r.totalRevenue,
                        totalTickets: r.totalTickets,
                        totalBookings: r.totalBookings,
                    })),
                },
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
exports.AdminSalesController = AdminSalesController;
