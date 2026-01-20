import { Request, Response } from "express";
import { AdminUserService } from "../../services/admin/user.service";
import {
  createUserDto,
  UpdateUserDto,
} from "../../dtos/user.dto";
import z from "zod";

let adminUserService = new AdminUserService();

export class AdminUserController {
  async createUser(req: Request, res: Response) {
    try {
      const parsedData = createUserDto.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsedData.error),
        });
      }

      const newAdmin = await adminUserService.createUser(parsedData.data);
      return res.status(201).json({
        success: true,
        message: "Admin registration successful",
        data: newAdmin,
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
      const users = await adminUserService.getAllUsers();
      return res.status(200).json({
        success: true,
        data: users,
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
      const user = await adminUserService.updateOneUser(userId, parsed.data);
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




