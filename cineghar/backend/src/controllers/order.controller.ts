import { Request, Response } from "express";
import { OrderModel } from "../models/order.model";
import { HttpError } from "../errors/http-error";

export class OrderController {
  /** GET /api/orders – list orders for the authenticated user */
  async getMyOrders(req: Request, res: Response) {
    const userId = (req.user as any)?._id;
    if (!userId) {
      throw new HttpError(401, "Unauthorized");
    }

    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const orders = await OrderModel.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      data: orders,
    });
  }
}
