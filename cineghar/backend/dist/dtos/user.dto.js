"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdminUserDto = exports.ResetPasswordDto = exports.ForgotPasswordDto = exports.LoginUserDto = exports.UpdateUserDto = exports.createUserDto = void 0;
const zod_1 = __importDefault(require("zod"));
const user_type_1 = require("../types/user.type");
exports.createUserDto = user_type_1.UserSchema.pick({
    name: true,
    email: true,
    password: true,
    dateOfBirth: true,
}).extend({
    confirmPassword: zod_1.default.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
exports.UpdateUserDto = user_type_1.UserSchema.pick({
    name: true,
    email: true,
    dateOfBirth: true,
    imageUrl: true,
}).partial();
exports.LoginUserDto = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6),
});
exports.ForgotPasswordDto = zod_1.default.object({
    email: zod_1.default.string().email(),
});
exports.ResetPasswordDto = zod_1.default
    .object({
    token: zod_1.default.string().min(1, "Token is required"),
    password: zod_1.default.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: zod_1.default.string().min(6),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
// Admin create user (multipart body; image from file)
exports.createAdminUserDto = user_type_1.UserSchema.pick({
    name: true,
    email: true,
    password: true,
    dateOfBirth: true,
})
    .extend({
    confirmPassword: zod_1.default.string().min(6),
    role: zod_1.default.enum(["user", "admin"]).optional().default("user"),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
