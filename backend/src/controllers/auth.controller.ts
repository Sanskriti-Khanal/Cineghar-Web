import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import {
  createUserDto,
  LoginUserDto,
  UpdateUserDto,
} from "../dtos/user.dto";
import z from "zod";

let userService = new UserService();

export class AuthController {
  async createUser(req: Request, res: Response) {
    try {
      const parsedData = createUserDto.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsedData.error),
        });
      }

      const newUser = await userService.registerUser(parsedData.data);
      return res.status(201).json({
        success: true,
        message: "Register Successful",
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
      const user = await userService.getOneUser(userId);
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
      const users = await userService.getAllUsers();
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
      await userService.deleteOneUser(userId);
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
      const user = await userService.updateOneUser(userId, parsed.data);
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

  async loginUser(req: Request, res: Response) {
    try {
      const parsedData = LoginUserDto.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsedData.error),
        });
      }
      const { token, user } = await userService.loginUser(parsedData.data);
      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: user,
        token,
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}

