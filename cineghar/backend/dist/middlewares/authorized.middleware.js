"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.selfOrAdminMiddleware = exports.adminMiddleware = exports.authorizedMiddleware = void 0;
const configs_1 = require("../configs");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_repository_1 = require("../repositories/user.repository");
const http_error_1 = require("../errors/http-error");
let userRepository = new user_repository_1.UserRepository();
const authorizedMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new http_error_1.HttpError(401, "Unauthorized JWT invalid");
        }
        const token = authHeader.split(" ")[1];
        const decodedToken = jsonwebtoken_1.default.verify(token, configs_1.JWT_SECRET);
        if (!decodedToken || !decodedToken.id) {
            throw new http_error_1.HttpError(401, "Unauthorized JWT unverified");
        }
        const user = await userRepository.getUserById(decodedToken.id);
        if (!user)
            throw new http_error_1.HttpError(401, "Unauthorized user not found");
        req.user = user;
        next();
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message,
        });
    }
};
exports.authorizedMiddleware = authorizedMiddleware;
const adminMiddleware = async (req, res, next) => {
    try {
        // req.user is added by authorizedMiddleware
        // any function after authorizedMiddleware can use req.user
        if (!req.user) {
            throw new http_error_1.HttpError(401, "Unauthorized no user info");
        }
        if (req.user.role !== "admin") {
            throw new http_error_1.HttpError(403, "Forbidden not admin");
        }
        return next();
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message,
        });
    }
};
exports.adminMiddleware = adminMiddleware;
/** Only the user themselves or an admin can access (use after authorizedMiddleware) */
const selfOrAdminMiddleware = (req, res, next) => {
    try {
        if (!req.user) {
            throw new http_error_1.HttpError(401, "Unauthorized no user info");
        }
        const targetId = req.params.id;
        const userId = req.user._id?.toString?.();
        if (userId === targetId || req.user.role === "admin") {
            return next();
        }
        throw new http_error_1.HttpError(403, "Forbidden: can only update own profile or as admin");
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message,
        });
    }
};
exports.selfOrAdminMiddleware = selfOrAdminMiddleware;
