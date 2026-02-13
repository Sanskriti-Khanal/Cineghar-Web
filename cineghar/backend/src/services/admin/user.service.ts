import { UserRepository } from "../../repositories/user.repository";
import type { createAdminUserDto } from "../../dtos/user.dto";
import type { UpdateUserDto } from "../../dtos/user.dto";
import type { PaginationDto } from "../../dtos/pagination.dto";
import bcryptjs from "bcryptjs";
import { HttpError } from "../../errors/http-error";

let userRepository = new UserRepository();

export class AdminUserService {
  async createUser(userData: createAdminUserDto & { imageUrl?: string }) {
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
      role: userData.role ?? "user",
      imageUrl: userData.imageUrl,
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

  async getAllUsers(pagination?: PaginationDto) {
    if (!pagination) {
      const users = await userRepository.getAllUsers();
      return { data: users ?? [], total: users?.length ?? 0, page: 1, limit: users?.length ?? 0, totalPages: 1 };
    }
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;
    const { users, total } = await userRepository.getUsersPaginated(skip, limit);
    const totalPages = Math.ceil(total / limit);
    return {
      data: users,
      total,
      page,
      limit,
      totalPages,
    };
  }
}




