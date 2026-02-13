"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUserController = void 0;
const user_service_1 = require("../../services/admin/user.service");
const user_dto_1 = require("../../dtos/user.dto");
const zod_1 = __importDefault(require("zod"));
let adminUserService = new user_service_1.AdminUserService();
class AdminUserController {
    async createUser(req, res) {
        try {
            const parsedData = user_dto_1.createAdminUserDto.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json({
                    success: false,
                    message: zod_1.default.prettifyError(parsedData.error),
                });
            }
            const payload = { ...parsedData.data };
            if (req.file) {
                payload.imageUrl = `/uploads/${req.file.filename}`;
            }
            const newUser = await adminUserService.createUser(payload);
            return res.status(201).json({
                success: true,
                message: "User created successfully",
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
            const user = await adminUserService.getOneUser(userId);
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
            const users = await adminUserService.getAllUsers();
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
            await adminUserService.deleteOneUser(userId);
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
        }
        catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
}
exports.AdminUserController = AdminUserController;
