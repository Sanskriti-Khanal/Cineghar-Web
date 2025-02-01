import { Request, Response } from "express";
import { AdminUserService } from "../../services/admin/user.service";
import {
  createAdminUserDto,
  UpdateUserDto,
} from "../../dtos/user.dto";
import { PaginationDto } from "../../dtos/pagination.dto";
import z from "zod";

let adminUserService = new AdminUserService();

export class AdminUserController {
  async createUser(req: Request, res: Response) {
    try {
      const parsedData = createAdminUserDto.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsedData.error),
        });
      }

      const payload = { ...parsedData.data };
      if (req.file) {
        (payload as Record<string, unknown>).imageUrl = `/uploads/${req.file.filename}`;
      }
      const newUser = await adminUserService.createUser(payload);
      return res.status(201).json({
        success: true,
        message: "User created successfully",
        data: newUser,
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async getOneUser(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const user = await adminUserService.getOneUser(userId);
      return res.status(200).json({
        success: true,
        data: user,
        message: "User fetched",
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const parsed = PaginationDto.safeParse(req.query);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsed.error),
        });
      }
      const result = await adminUserService.getAllUsers(parsed.data);
      return res.status(200).json({
        success: true,
        data: result.data,
        meta: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
        message: "Users fetched successfully",
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      await adminUserService.deleteOneUser(userId);
      return res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const parsed = UpdateUserDto.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsed.error),
        });
      }
      const updateData = { ...parsed.data };
      if (req.file) {
        updateData.imageUrl = `/uploads/${req.file.filename}`;
      }
      const user = await adminUserService.updateOneUser(userId, updateData);
      return res.status(200).json({
        success: true,
        data: user,
        message: "User data successfully updated",
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}




