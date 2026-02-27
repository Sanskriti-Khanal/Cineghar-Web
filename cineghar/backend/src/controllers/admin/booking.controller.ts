import { Request, Response } from "express";
import { CinemaHallModel } from "../../models/cinema-hall.model";
import { ShowtimeModel } from "../../models/showtime.model";
import {
  CreateCinemaHallDto,
  UpdateCinemaHallDto,
  CreateShowtimeDto,
  UpdateShowtimeDto,
} from "../../dtos/booking.dto";
import { PaginationDto } from "../../dtos/pagination.dto";
import z from "zod";
import { HttpError } from "../../errors/http-error";

export class AdminCinemaHallController {
  async create(req: Request, res: Response) {
    try {
      const parsed = CreateCinemaHallDto.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsed.error),
        });
      }
      const hall = await CinemaHallModel.create(parsed.data);
      return res.status(201).json({
        success: true,
        message: "Cinema hall created",
        data: hall,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const parsed = PaginationDto.safeParse(req.query);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsed.error),
        });
      }
      const { page, limit } = parsed.data;
      const skip = (page - 1) * limit;
      const [halls, total] = await Promise.all([
        CinemaHallModel.find().skip(skip).limit(limit).lean(),
        CinemaHallModel.countDocuments(),
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
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const hall = await CinemaHallModel.findById(id).lean();
      if (!hall) throw new HttpError(404, "Cinema hall not found");
      return res.status(200).json({
        success: true,
        data: hall,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const parsed = UpdateCinemaHallDto.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsed.error),
        });
      }
      const hall = await CinemaHallModel.findByIdAndUpdate(id, parsed.data, {
        new: true,
      }).lean();
      if (!hall) throw new HttpError(404, "Cinema hall not found");
      return res.status(200).json({
        success: true,
        message: "Cinema hall updated",
        data: hall,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const deleted = await CinemaHallModel.findByIdAndDelete(id).lean();
      if (!deleted) throw new HttpError(404, "Cinema hall not found");
      return res.status(200).json({
        success: true,
        message: "Cinema hall deleted",
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}

export class AdminShowtimeController {
  async create(req: Request, res: Response) {
    try {
      const parsed = CreateShowtimeDto.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsed.error),
        });
      }
      const data = parsed.data;
      const startTime = new Date(data.startTime);
      const showtime = await ShowtimeModel.create({
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
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const parsed = PaginationDto.safeParse(req.query);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsed.error),
        });
      }
      const { page, limit } = parsed.data;
      const skip = (page - 1) * limit;
      const [showtimes, total] = await Promise.all([
        ShowtimeModel.find()
          .populate("movie")
          .populate("hall")
          .skip(skip)
          .limit(limit)
          .lean(),
        ShowtimeModel.countDocuments(),
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
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const showtime = await ShowtimeModel.findById(id)
        .populate("movie")
        .populate("hall")
        .lean();
      if (!showtime) throw new HttpError(404, "Showtime not found");
      return res.status(200).json({
        success: true,
        data: showtime,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const parsed = UpdateShowtimeDto.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsed.error),
        });
      }
      const data = parsed.data;
      const update: Record<string, unknown> = {};
      if (data.movieId) update.movie = data.movieId;
      if (data.hallId) update.hall = data.hallId;
      if (data.startTime) update.startTime = new Date(data.startTime);
      if (data.isActive !== undefined) update.isActive = data.isActive;
      const showtime = await ShowtimeModel.findByIdAndUpdate(id, update, {
        new: true,
      })
        .populate("movie")
        .populate("hall")
        .lean();
      if (!showtime) throw new HttpError(404, "Showtime not found");
      return res.status(200).json({
        success: true,
        message: "Showtime updated",
        data: showtime,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const deleted = await ShowtimeModel.findByIdAndDelete(id).lean();
      if (!deleted) throw new HttpError(404, "Showtime not found");
      return res.status(200).json({
        success: true,
        message: "Showtime deleted",
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}

