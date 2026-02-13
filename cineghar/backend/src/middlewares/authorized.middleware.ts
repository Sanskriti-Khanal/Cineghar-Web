import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "../configs";
import jwt from "jsonwebtoken";
import { IUser } from "../models/user.model";
import { UserRepository } from "../repositories/user.repository";
import { HttpError } from "../errors/http-error";

declare global {
  namespace Express {
    interface Request {
      user?: Record<string, any> | IUser;
    }
  }
}

let userRepository = new UserRepository();

export const authorizedMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new HttpError(401, "Unauthorized JWT invalid");
    }
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, JWT_SECRET) as Record<string, any>;
    if (!decodedToken || !decodedToken.id) {
      throw new HttpError(401, "Unauthorized JWT unverified");
    }
    const user = await userRepository.getUserById(decodedToken.id);
    if (!user) throw new HttpError(401, "Unauthorized user not found");
    req.user = user;
    next();
  } catch (err: Error | any) {
    const status =
      err.statusCode ??
      (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError"
        ? 401
        : 500);
    return res.status(status).json({
      success: false,
      message: err.message ?? "Unauthorized",
    });
  }
};

export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // req.user is added by authorizedMiddleware
    // any function after authorizedMiddleware can use req.user
    if (!req.user) {
      throw new HttpError(401, "Unauthorized no user info");
    }
    if (req.user.role !== "admin") {
      throw new HttpError(403, "Forbidden not admin");
    }
    return next();
  } catch (err: Error | any) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
    });
  }
};

/** Only the user themselves or an admin can access (use after authorizedMiddleware) */
export const selfOrAdminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new HttpError(401, "Unauthorized no user info");
    }
    const targetId = req.params.id;
    const userId = (req.user as IUser)._id?.toString?.();
    if (userId === targetId || req.user.role === "admin") {
      return next();
    }
    throw new HttpError(403, "Forbidden: can only update own profile or as admin");
  } catch (err: Error | any) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
    });
  }
};

