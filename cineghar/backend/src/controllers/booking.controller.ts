import { Request, Response } from "express";
import { CinemaHallModel, type City } from "../models/cinema-hall.model";
import { ShowtimeModel } from "../models/showtime.model";
import { SeatHoldModel } from "../models/seat-hold.model";
import { BookingModel } from "../models/booking.model";
import { UserModel } from "../models/user.model";
import { LoyaltyTransactionModel } from "../models/loyalty-transaction.model";
import { LoyaltyRuleModel } from "../models/loyalty-rule.model";
import { HttpError } from "../errors/http-error";

const SEAT_PRICE = 350;
const HOLD_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours

export class BookingController {
  async getCities(_req: Request, res: Response) {
    const cities: City[] = ["Kathmandu", "Pokhara", "Chitwan"];
    return res.status(200).json({
      success: true,
      data: cities.map((c) => ({ id: c, name: c })),
    });
  }

  async getHalls(req: Request, res: Response) {
    try {
      const city = req.query.city as City | undefined;
      const filter: Record<string, unknown> = { isActive: true };
      if (city) filter.city = city;
      const halls = await CinemaHallModel.find(filter).lean();
      return res.status(200).json({
        success: true,
        data: halls,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async getShowtimes(req: Request, res: Response) {
    try {
      const { movieId, hallId, date } = req.query;
      if (!movieId) {
        throw new HttpError(400, "movieId is required");
      }
      const filter: Record<string, unknown> = {
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
        const start = new Date(
          base.getFullYear(),
          base.getMonth(),
          base.getDate(),
          0,
          0,
          0,
          0
        );
        const end = new Date(
          base.getFullYear(),
          base.getMonth(),
          base.getDate(),
          23,
          59,
          59,
          999
        );
        filter.startTime = { $gte: start, $lte: end };
      }
      const showtimes = await ShowtimeModel.find(filter)
        .populate("hall")
        .lean();
      return res.status(200).json({
        success: true,
        data: showtimes,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async getSeats(req: Request, res: Response) {
    try {
      const showtimeId = String(req.params.id);
      const showtime = await ShowtimeModel.findById(showtimeId);
      if (!showtime) {
        throw new HttpError(404, "Showtime not found");
      }
      const now = new Date();
      const bookings = await BookingModel.find({
        showtime: showtimeId,
        status: "confirmed",
      }).lean();
      const holds = await SeatHoldModel.find({
        showtime: showtimeId,
        expiresAt: { $gt: now },
      }).lean();

      const bookedSeats = new Set<string>();
      bookings.forEach((b) => {
        b.seats.forEach((seat) => bookedSeats.add(seat));
      });

      const heldSeats: { seatId: string; expiresAt: Date }[] = [];
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
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async holdSeats(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user?._id) {
        throw new HttpError(401, "Unauthorized");
      }
      const { showtimeId, seats } = req.body as {
        showtimeId?: string;
        seats?: string[];
      };
      if (!showtimeId || !Array.isArray(seats) || seats.length === 0) {
        throw new HttpError(400, "showtimeId and seats are required");
      }
      const showtime = await ShowtimeModel.findById(showtimeId);
      if (!showtime) {
        throw new HttpError(404, "Showtime not found");
      }
      const now = new Date();
      const expiresAt = new Date(now.getTime() + HOLD_DURATION_MS);

      const bookings = await BookingModel.find({
        showtime: showtimeId,
        status: "confirmed",
      }).lean();
      const bookedSeats = new Set<string>();
      bookings.forEach((b) => b.seats.forEach((s) => bookedSeats.add(s)));

      const existingHolds = await SeatHoldModel.find({
        showtime: showtimeId,
        expiresAt: { $gt: now },
      }).lean();
      const heldByOthers = new Set<string>();
      existingHolds.forEach((h) => {
        if (String(h.user) !== String(user._id)) {
          h.seats.forEach((s) => heldByOthers.add(s));
        }
      });

      const conflict = seats.find(
        (s) => bookedSeats.has(s) || heldByOthers.has(s)
      );
      if (conflict) {
        throw new HttpError(
          409,
          `Seat ${conflict} is already booked or held by another user`
        );
      }

      const existingHold = await SeatHoldModel.findOne({
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

      const newHold = await SeatHoldModel.create({
        showtime: showtimeId,
        user: user._id,
        seats,
        expiresAt,
      });

      return res.status(201).json({
        success: true,
        data: newHold,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async confirmBooking(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user?._id) {
        throw new HttpError(401, "Unauthorized");
      }
      const { showtimeId } = req.body as { showtimeId?: string };
      if (!showtimeId) {
        throw new HttpError(400, "showtimeId is required");
      }
      const showtime = await ShowtimeModel.findById(showtimeId);
      if (!showtime) {
        throw new HttpError(404, "Showtime not found");
      }
      const now = new Date();
      const hold = await SeatHoldModel.findOne({
        showtime: showtimeId,
        user: user._id,
        expiresAt: { $gt: now },
      });
      if (!hold || hold.seats.length === 0) {
        throw new HttpError(400, "No valid held seats to confirm");
      }

      const existingBookings = await BookingModel.find({
        showtime: showtimeId,
        status: "confirmed",
      }).lean();
      const bookedSeats = new Set<string>();
      existingBookings.forEach((b) => b.seats.forEach((s) => bookedSeats.add(s)));
      const conflict = hold.seats.find((s) => bookedSeats.has(s));
      if (conflict) {
        throw new HttpError(
          409,
          `Seat ${conflict} was just booked by another user`
        );
      }

      const totalPrice = hold.seats.length * SEAT_PRICE;

      const [booking] = await Promise.all([
        BookingModel.create({
          showtime: showtimeId,
          user: user._id,
          seats: hold.seats,
          totalPrice,
          status: "confirmed",
        }),
        SeatHoldModel.deleteOne({ _id: hold._id }),
      ]);

      // Loyalty earning: use active rule if present, otherwise default 1 point per 100 currency units
      const activeRule = await LoyaltyRuleModel.findOne({
        isActive: true,
        startDate: { $lte: now },
        $or: [{ endDate: { $gte: now } }, { endDate: { $exists: false } }],
      })
        .sort({ startDate: -1 })
        .lean();

      const pointsPerCurrencyUnit =
        activeRule?.pointsPerCurrencyUnit ?? 0.01; // fallback: 1 point per 100

      const earnedPoints = Math.floor(totalPrice * pointsPerCurrencyUnit);
      if (earnedPoints > 0) {
        const dbUser = await UserModel.findById(user._id);
        if (dbUser) {
          dbUser.loyaltyPoints = (dbUser.loyaltyPoints ?? 0) + earnedPoints;
          await dbUser.save();
          await LoyaltyTransactionModel.create({
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
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}

