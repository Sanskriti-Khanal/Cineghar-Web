import { Request, Response } from "express";
import { OrderModel } from "../../models/order.model";
import { BookingModel } from "../../models/booking.model";
import { MovieModel } from "../../models/movie.model";
import { ShowtimeModel } from "../../models/showtime.model";

function getTodayStartEnd() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  return { start, end };
}

export class AdminDashboardController {
  async stats(req: Request, res: Response) {
    try {
      const { start, end } = getTodayStartEnd();

      const [
        totalMovies,
        todayOrdersCount,
        todayOrdersRevenue,
        todayBookingsCount,
        todayBookingsRevenue,
        activeShowsToday,
      ] = await Promise.all([
        MovieModel.countDocuments(),
        OrderModel.countDocuments({ createdAt: { $gte: start, $lte: end } }),
        OrderModel.aggregate([
          { $match: { createdAt: { $gte: start, $lte: end } } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]).then((r) => r[0]?.total ?? 0),
        BookingModel.countDocuments({
          status: "confirmed",
          createdAt: { $gte: start, $lte: end },
        }),
        BookingModel.aggregate([
          { $match: { status: "confirmed", createdAt: { $gte: start, $lte: end } } },
          { $group: { _id: null, total: { $sum: "$totalPrice" } } },
        ]).then((r) => r[0]?.total ?? 0),
        ShowtimeModel.countDocuments({
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
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async recentOrders(req: Request, res: Response) {
    try {
      const limit = Math.min(Number(req.query.limit) || 10, 50);
      const orders = await OrderModel.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate("user", "name email")
        .lean();

      const bookings = await BookingModel.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate("user", "name email")
        .populate({ path: "showtime", populate: { path: "movie", select: "title" } })
        .lean();

      const combined = [
        ...orders.map((o: any) => ({
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
        ...bookings.map((b: any) => ({
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
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}
