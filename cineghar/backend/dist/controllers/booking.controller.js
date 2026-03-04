"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingController = void 0;
const cinema_hall_model_1 = require("../models/cinema-hall.model");
const showtime_model_1 = require("../models/showtime.model");
const seat_hold_model_1 = require("../models/seat-hold.model");
const booking_model_1 = require("../models/booking.model");
const user_model_1 = require("../models/user.model");
const loyalty_transaction_model_1 = require("../models/loyalty-transaction.model");
const http_error_1 = require("../errors/http-error");
const SEAT_PRICE = 350;
const HOLD_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours
class BookingController {
    async getCities(_req, res) {
        const cities = ["Kathmandu", "Pokhara", "Chitwan"];
        return res.status(200).json({
            success: true,
            data: cities.map((c) => ({ id: c, name: c })),
        });
    }
    async getHalls(req, res) {
        try {
            const city = req.query.city;
            const filter = { isActive: true };
            if (city)
                filter.city = city;
            const halls = await cinema_hall_model_1.CinemaHallModel.find(filter).lean();
            return res.status(200).json({
                success: true,
                data: halls,
            });
        }
        catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
    async getShowtimes(req, res) {
        try {
            const { movieId, hallId, date } = req.query;
            if (!movieId) {
                throw new http_error_1.HttpError(400, "movieId is required");
            }
            const filter = {
                movie: movieId,
                isActive: true,
            };
            if (hallId) {
                filter.hall = hallId;
            }
            if (date === "today" || date === "tomorrow") {
                const base = new Date();
                if (date === "tomorrow") {
                    base.setDate(base.getDate() + 1);
                }
                const start = new Date(base.getFullYear(), base.getMonth(), base.getDate(), 0, 0, 0, 0);
                const end = new Date(base.getFullYear(), base.getMonth(), base.getDate(), 23, 59, 59, 999);
                filter.startTime = { $gte: start, $lte: end };
            }
            const showtimes = await showtime_model_1.ShowtimeModel.find(filter)
                .populate("hall")
                .lean();
            return res.status(200).json({
                success: true,
                data: showtimes,
            });
        }
        catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
    async getSeats(req, res) {
        try {
            const showtimeId = String(req.params.id);
            const showtime = await showtime_model_1.ShowtimeModel.findById(showtimeId);
            if (!showtime) {
                throw new http_error_1.HttpError(404, "Showtime not found");
            }
            const now = new Date();
            const bookings = await booking_model_1.BookingModel.find({
                showtime: showtimeId,
                status: "confirmed",
            }).lean();
            const holds = await seat_hold_model_1.SeatHoldModel.find({
                showtime: showtimeId,
                expiresAt: { $gt: now },
            }).lean();
            const bookedSeats = new Set();
            bookings.forEach((b) => {
                b.seats.forEach((seat) => bookedSeats.add(seat));
            });
            const heldSeats = [];
            holds.forEach((h) => {
                h.seats.forEach((seat) => {
                    if (!bookedSeats.has(seat)) {
                        heldSeats.push({ seatId: seat, expiresAt: h.expiresAt });
                    }
                });
            });
            return res.status(200).json({
                success: true,
                data: {
                    rows: ["A", "B", "C", "D", "E", "F", "G"],
                    columns: 12,
                    bookedSeats: Array.from(bookedSeats),
                    heldSeats,
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
    async holdSeats(req, res) {
        try {
            const user = req.user;
            if (!user?._id) {
                throw new http_error_1.HttpError(401, "Unauthorized");
            }
            const { showtimeId, seats } = req.body;
            if (!showtimeId || !Array.isArray(seats) || seats.length === 0) {
                throw new http_error_1.HttpError(400, "showtimeId and seats are required");
            }
            const showtime = await showtime_model_1.ShowtimeModel.findById(showtimeId);
            if (!showtime) {
                throw new http_error_1.HttpError(404, "Showtime not found");
            }
            const now = new Date();
            const expiresAt = new Date(now.getTime() + HOLD_DURATION_MS);
            const bookings = await booking_model_1.BookingModel.find({
                showtime: showtimeId,
                status: "confirmed",
            }).lean();
            const bookedSeats = new Set();
            bookings.forEach((b) => b.seats.forEach((s) => bookedSeats.add(s)));
            const existingHolds = await seat_hold_model_1.SeatHoldModel.find({
                showtime: showtimeId,
                expiresAt: { $gt: now },
            }).lean();
            const heldByOthers = new Set();
            existingHolds.forEach((h) => {
                if (String(h.user) !== String(user._id)) {
                    h.seats.forEach((s) => heldByOthers.add(s));
                }
            });
            const conflict = seats.find((s) => bookedSeats.has(s) || heldByOthers.has(s));
            if (conflict) {
                throw new http_error_1.HttpError(409, `Seat ${conflict} is already booked or held by another user`);
            }
            const existingHold = await seat_hold_model_1.SeatHoldModel.findOne({
                showtime: showtimeId,
                user: user._id,
            });
            if (existingHold) {
                const merged = new Set(existingHold.seats);
                seats.forEach((s) => merged.add(s));
                existingHold.seats = Array.from(merged);
                existingHold.expiresAt = expiresAt;
                await existingHold.save();
                return res.status(200).json({
                    success: true,
                    data: existingHold,
                });
            }
            const newHold = await seat_hold_model_1.SeatHoldModel.create({
                showtime: showtimeId,
                user: user._id,
                seats,
                expiresAt,
            });
            return res.status(201).json({
                success: true,
                data: newHold,
            });
        }
        catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
    async confirmBooking(req, res) {
        try {
            const user = req.user;
            if (!user?._id) {
                throw new http_error_1.HttpError(401, "Unauthorized");
            }
            const { showtimeId } = req.body;
            if (!showtimeId) {
                throw new http_error_1.HttpError(400, "showtimeId is required");
            }
            const showtime = await showtime_model_1.ShowtimeModel.findById(showtimeId);
            if (!showtime) {
                throw new http_error_1.HttpError(404, "Showtime not found");
            }
            const now = new Date();
            const hold = await seat_hold_model_1.SeatHoldModel.findOne({
                showtime: showtimeId,
                user: user._id,
                expiresAt: { $gt: now },
            });
            if (!hold || hold.seats.length === 0) {
                throw new http_error_1.HttpError(400, "No valid held seats to confirm");
            }
            const existingBookings = await booking_model_1.BookingModel.find({
                showtime: showtimeId,
                status: "confirmed",
            }).lean();
            const bookedSeats = new Set();
            existingBookings.forEach((b) => b.seats.forEach((s) => bookedSeats.add(s)));
            const conflict = hold.seats.find((s) => bookedSeats.has(s));
            if (conflict) {
                throw new http_error_1.HttpError(409, `Seat ${conflict} was just booked by another user`);
            }
            const totalPrice = hold.seats.length * SEAT_PRICE;
            const [booking] = await Promise.all([
                booking_model_1.BookingModel.create({
                    showtime: showtimeId,
                    user: user._id,
                    seats: hold.seats,
                    totalPrice,
                    status: "confirmed",
                }),
                seat_hold_model_1.SeatHoldModel.deleteOne({ _id: hold._id }),
            ]);
            // Loyalty earning: 5 points per ticket (seat)
            const earnedPoints = hold.seats.length * 5;
            if (earnedPoints > 0) {
                const dbUser = await user_model_1.UserModel.findById(user._id);
                if (dbUser) {
                    dbUser.loyaltyPoints = (dbUser.loyaltyPoints ?? 0) + earnedPoints;
                    await dbUser.save();
                    await loyalty_transaction_model_1.LoyaltyTransactionModel.create({
                        user: dbUser._id,
                        change: earnedPoints,
                        reason: "Points earned from booking",
                        booking: booking._id,
                        meta: { totalPrice },
                    });
                }
            }
            return res.status(201).json({
                success: true,
                data: booking,
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
exports.BookingController = BookingController;
