import crypto from "crypto";
import { UserRepository } from "../repositories/user.repository";
import { createUserDto } from "../dtos/user.dto";
import type { LoginUserDto, UpdateUserDto } from "../dtos/user.dto";
import bcryptjs from "bcryptjs";
import { HttpError } from "../errors/http-error";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../configs";
import { EmailService } from "./email.service";

const RESET_TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

let userRepository = new UserRepository();
const emailService = new EmailService();

export class UserService {
  async registerUser(userData: createUserDto) {
    const checkEmail = await userRepository.getUserByEmail(userData.email);

    if (checkEmail) {
      throw new HttpError(409, "Email already in use");
    }

    const hashedPassword = await bcryptjs.hash(userData.password, 10);

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

  async getOneUser(userId: string) {
    const user = await userRepository.getUserById(userId);
    if (!user) {
      throw new HttpError(404, "User not found");
    }
    return user;
  }

  async deleteOneUser(userId: string) {
    const user = await userRepository.getUserById(userId);
    if (!user) {
      throw new HttpError(404, "User not found");
    }
    const result = await userRepository.deleteUser(userId);
    if (!result) {
      throw new HttpError(500, "Failed to delete user");
    }
    return result;
  }

  async updateOneUser(userId: string, updateData: UpdateUserDto) {
    const user = await userRepository.getUserById(userId);
    if (!user) {
      throw new HttpError(404, "User not found");
    }
    const updateUser = await userRepository.updateUser(userId, updateData);
    if (!updateUser) {
      throw new HttpError(500, "Failed to update user");
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

  async loginUser(loginData: LoginUserDto) {
    const user = await userRepository.getUserByEmail(loginData.email);
    if (!user) {
      throw new HttpError(404, "User not found");
    }
    const validPassword = await bcryptjs.compare(
      loginData.password,
      user.password
    );
    if (!validPassword) {
      throw new HttpError(401, "Invalid credentials");
    }
    const payload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });

    const userResponse = user.toObject();
    delete userResponse.password;
    return { token, user: userResponse };
  }

  /** Generate secure reset token, save with expiry, and send reset link email; no-op if user not found. */
  async requestPasswordReset(email: string): Promise<void> {
    const user = await userRepository.getUserByEmail(email);
    if (!user) return;

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + RESET_TOKEN_EXPIRY_MS);

    await userRepository.updateUser(user._id.toString(), {
      resetPasswordToken: token,
      resetPasswordExpires: expires,
    });

    try {
      await emailService.sendResetPasswordEmail(user.email, token);
    } catch (err) {
      console.error("Failed to send reset password email:", err);
      // Do not throw; API still returns generic success to avoid leaking user existence
    }
  }
}

