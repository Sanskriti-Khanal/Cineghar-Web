"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const user_repository_1 = require("../repositories/user.repository");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_error_1 = require("../errors/http-error");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const configs_1 = require("../configs");
const email_service_1 = require("./email.service");
const RESET_TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour
let userRepository = new user_repository_1.UserRepository();
const emailService = new email_service_1.EmailService();
class UserService {
    async registerUser(userData) {
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
            role: "user",
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
    async loginUser(loginData) {
        const user = await userRepository.getUserByEmail(loginData.email);
        if (!user) {
            throw new http_error_1.HttpError(404, "User not found");
        }
        const validPassword = await bcryptjs_1.default.compare(loginData.password, user.password);
        if (!validPassword) {
            throw new http_error_1.HttpError(401, "Invalid credentials");
        }
        const payload = {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
        };
        const token = jsonwebtoken_1.default.sign(payload, configs_1.JWT_SECRET, { expiresIn: "30d" });
        const userResponse = user.toObject();
        delete userResponse.password;
        return { token, user: userResponse };
    }
    /** Generate secure reset token, save with expiry, and send reset link email; no-op if user not found. */
    async requestPasswordReset(email) {
        const user = await userRepository.getUserByEmail(email);
        if (!user)
            return;
        const token = crypto_1.default.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + RESET_TOKEN_EXPIRY_MS);
        await userRepository.updateUser(user._id.toString(), {
            resetPasswordToken: token,
            resetPasswordExpires: expires,
        });
        try {
            await emailService.sendResetPasswordEmail(user.email, token);
        }
        catch (err) {
            console.error("Failed to send reset password email:", err);
            // Do not throw; API still returns generic success to avoid leaking user existence
        }
    }
    /** Verify token + expiry, hash new password, update user and clear reset token. */
    async resetPassword(token, newPassword) {
        const user = await userRepository.getUserByResetToken(token);
        if (!user) {
            throw new http_error_1.HttpError(400, "Invalid or expired reset token");
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await userRepository.setPasswordAndClearResetToken(user._id.toString(), hashedPassword);
    }
}
exports.UserService = UserService;
