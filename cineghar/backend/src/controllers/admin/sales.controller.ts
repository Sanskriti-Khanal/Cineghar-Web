import { Request, Response } from "express";
import z from "zod";
import { BookingModel } from "../../models/booking.model";
import { HttpError } from "../../errors/http-error";

const SalesQueryDto = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  groupBy: z.enum(["movie", "day"]).optional(),
});

type SalesQueryDtoType = z.infer<typeof SalesQueryDto>;

function getDateRange(query: SalesQueryDtoType) {
  const now = new Date();
  const defaultFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const from = query.from ? new Date(query.from) : defaultFrom;
  const to = query.to ? new Date(query.to) : now;

  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    throw new HttpError(400, "Invalid from/to date");
  }
  if (from > to) {
    throw new HttpError(400, "`from` date cannot be after `to` date");
  }

  return { from, to };
}

export class AdminSalesController {
  async summary(req: Request, res: Response) {
    try {
      const parsed = SalesQueryDto.safeParse(req.query);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsed.error),
        });
      }

      const { groupBy } = parsed.data;
      const { from, to } = getDateRange(parsed.data);

      const matchStage = {
        $match: {
          status: "confirmed",
          createdAt: { $gte: from, $lte: to },
        },
      } as const;

      if (!groupBy) {
        const [result] = await BookingModel.aggregate([
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
        const results = await BookingModel.aggregate([
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
      const results = await BookingModel.aggregate([
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
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}

