"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminDashboardController = void 0;
const order_model_1 = require("../../models/order.model");
const booking_model_1 = require("../../models/booking.model");
const movie_model_1 = require("../../models/movie.model");
const showtime_model_1 = require("../../models/showtime.model");
function getTodayStartEnd() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    return { start, end };
}
class AdminDashboardController {
    async stats(req, res) {
        try {
            const { start, end } = getTodayStartEnd();
            const [totalMovies, todayOrdersCount, todayOrdersRevenue, todayBookingsCount, todayBookingsRevenue, activeShowsToday,] = await Promise.all([
                movie_model_1.MovieModel.countDocuments(),
                order_model_1.OrderModel.countDocuments({ createdAt: { $gte: start, $lte: end } }),
                order_model_1.OrderModel.aggregate([
                    { $match: { createdAt: { $gte: start, $lte: end } } },
                    { $group: { _id: null, total: { $sum: "$amount" } } },
                ]).then((r) => r[0]?.total ?? 0),
                booking_model_1.BookingModel.countDocuments({
                    status: "confirmed",
                    createdAt: { $gte: start, $lte: end },
                }),
                booking_model_1.BookingModel.aggregate([
                    { $match: { status: "confirmed", createdAt: { $gte: start, $lte: end } } },
                    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
                ]).then((r) => r[0]?.total ?? 0),
                showtime_model_1.ShowtimeModel.countDocuments({
                    isActive: true,
                    startTime: { $gte: start, $lte: end },
                }),
            ]);
            const todayBookings = todayOrdersCount + todayBookingsCount;
            const todayRevenue = todayOrdersRevenue + todayBookingsRevenue;
            return res.status(200).json({
                success: true,
                data: {
                    totalMovies,
                    todayBookings,
                    activeShowsToday,
                    todayRevenue,
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
    async recentOrders(req, res) {
        try {
            const limit = Math.min(Number(req.query.limit) || 10, 50);
            const orders = await order_model_1.OrderModel.find()
                .sort({ createdAt: -1 })
                .limit(limit)
                .populate("user", "name email")
                .lean();
            const bookings = await booking_model_1.BookingModel.find()
                .sort({ createdAt: -1 })
                .limit(limit)
                .populate("user", "name email")
                .populate({ path: "showtime", populate: { path: "movie", select: "title" } })
                .lean();
            const combined = [
                ...orders.map((o) => ({
                    _id: o._id,
                    type: "order",
                    user: o.user,
                    amount: o.amount,
                    seatsCount: o.seatsCount,
                    seats: o.seats,
                    movieTitle: o.movieTitle,
                    createdAt: o.createdAt,
                    status: o.status,
                })),
                ...bookings.map((b) => ({
                    _id: b._id,
                    type: "booking",
                    user: b.user,
                    amount: b.totalPrice,
                    seatsCount: (b.seats && b.seats.length) || 0,
                    seats: b.seats || [],
                    movieTitle: b.showtime?.movie?.title ?? null,
                    createdAt: b.createdAt,
                    status: b.status,
                })),
            ]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, limit);
            return res.status(200).json({
                success: true,
                data: combined,
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
exports.AdminDashboardController = AdminDashboardController;
