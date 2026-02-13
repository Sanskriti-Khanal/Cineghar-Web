"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUserService = void 0;
const user_repository_1 = require("../../repositories/user.repository");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_error_1 = require("../../errors/http-error");
let userRepository = new user_repository_1.UserRepository();
class AdminUserService {
    async createUser(userData) {
        const checkEmail = await userRepository.getUserByEmail(userData.email);
        if (checkEmail) {
            throw new http_error_1.HttpError(409, "Email already in use");
        }
        const hashedPassword = await bcryptjs_1.default.hash(userData.password, 10);
        const newUser = await userRepository.createUser({
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            dateOfBirth: userData.dateOfBirth,
            role: userData.role ?? "user",
            imageUrl: userData.imageUrl,
        });
        const userResponse = newUser.toObject();
        delete userResponse.password;
        return userResponse;
    }
    async getOneUser(userId) {
        const user = await userRepository.getUserById(userId);
        if (!user) {
            throw new http_error_1.HttpError(404, "User not found");
        }
        return user;
    }
    async deleteOneUser(userId) {
        const user = await userRepository.getUserById(userId);
        if (!user) {
            throw new http_error_1.HttpError(404, "User not found");
        }
        const result = await userRepository.deleteUser(userId);
        if (!result) {
            throw new http_error_1.HttpError(500, "Failed to delete user");
        }
        return result;
    }
    async updateOneUser(userId, updateData) {
        const user = await userRepository.getUserById(userId);
        if (!user) {
            throw new http_error_1.HttpError(404, "User not found");
        }
        const updateUser = await userRepository.updateUser(userId, updateData);
        if (!updateUser) {
            throw new http_error_1.HttpError(500, "Failed to update user");
        }
        return updateUser;
    }
    async getAllUsers() {
        const users = await userRepository.getAllUsers();
        if (!users || users.length === 0) {
            return [];
        }
        return users;
    }
}
exports.AdminUserService = AdminUserService;
