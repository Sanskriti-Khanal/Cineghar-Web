"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const user_service_1 = require("../services/user.service");
const user_dto_1 = require("../dtos/user.dto");
const zod_1 = __importDefault(require("zod"));
const userService = new user_service_1.UserService();
class AuthController {
    async getProfile(req, res) {
        try {
            const userId = req.user?._id;
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: "User Id not found",
                });
            }
            const user = await userService.getOneUser(userId.toString());
            return res.status(200).json({
                success: true,
                data: user,
                message: "User profile fetched successfully",
            });
        }
        catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
    async updateProfile(req, res) {
        try {
            const userId = req.user?._id;
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: "User Id not found",
                });
            }
            const parsed = user_dto_1.UpdateUserDto.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    success: false,
                    message: zod_1.default.prettifyError(parsed.error),
                });
            }
            const updateData = parsed.data;
            if (req.file) {
                updateData.imageUrl = `/uploads/${req.file.filename}`;
            }
            const user = await userService.updateOneUser(userId.toString(), updateData);
            return res.status(200).json({
                success: true,
                data: user,
                message: "User profile updated successfully",
            });
        }
        catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
    async createUser(req, res) {
        try {
            const parsedData = user_dto_1.createUserDto.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json({
                    success: false,
                    message: zod_1.default.prettifyError(parsedData.error),
                });
            }
            const newUser = await userService.registerUser(parsedData.data);
            return res.status(201).json({
                success: true,
                message: "Register Successful",
                data: newUser,
            });
        }
        catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
    async getOneUser(req, res) {
        try {
            const userId = req.params.id;
            const user = await userService.getOneUser(userId);
            return res.status(200).json({
                success: true,
                data: user,
                message: "User fetched",
            });
        }
        catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
    async getAllUsers(req, res) {
        try {
            const users = await userService.getAllUsers();
            return res.status(200).json({
                success: true,
                data: users,
                message: "Users fetched successfully",
            });
        }
        catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
    async deleteUser(req, res) {
        try {
            const userId = req.params.id;
            await userService.deleteOneUser(userId);
            return res.status(200).json({
                success: true,
                message: "User deleted successfully",
            });
        }
        catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
    async updateUser(req, res) {
        try {
            const userId = req.params.id;
            const parsed = user_dto_1.UpdateUserDto.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    success: false,
                    message: zod_1.default.prettifyError(parsed.error),
                });
            }
            const user = await userService.updateOneUser(userId, parsed.data);
            return res.status(200).json({
                success: true,
                data: user,
                message: "User data successfully updated",
            });
        }
        catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
    /** PUT /api/auth/:id - update user by id (self or admin), with optional image */
    async updateUserById(req, res) {
        try {
            const userId = req.params.id;
            const parsed = user_dto_1.UpdateUserDto.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    success: false,
                    message: zod_1.default.prettifyError(parsed.error),
                });
            }
            const updateData = { ...parsed.data };
            if (req.file) {
                updateData.imageUrl = `/uploads/${req.file.filename}`;
            }
            const user = await userService.updateOneUser(userId, updateData);
            return res.status(200).json({
                success: true,
                data: user,
                message: "User updated successfully",
            });
        }
        catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
    async loginUser(req, res) {
        try {
            const parsedData = user_dto_1.LoginUserDto.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json({
                    success: false,
                    message: zod_1.default.prettifyError(parsedData.error),
                });
            }
            const { token, user } = await userService.loginUser(parsedData.data);
            return res.status(200).json({
                success: true,
                message: "Login successful",
                data: user,
                token,
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
exports.AuthController = AuthController;
