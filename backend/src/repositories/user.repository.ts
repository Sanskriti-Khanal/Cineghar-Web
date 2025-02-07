import { UserModel, IUser } from "../models/user.model";

export interface PaginatedUsersResult {
  users: IUser[];
  total: number;
}

export interface IUserRepository {
  createUser(userData: Partial<IUser>): Promise<IUser>;
  getUserByEmail(email: string): Promise<IUser | null>;
  getUserById(userId: string): Promise<IUser | null>;
  getUserByResetToken(token: string): Promise<IUser | null>;
  getAllUsers(): Promise<IUser[]>;
  findAllPaginated(page: number, limit: number): Promise<PaginatedUsersResult>;
  getUsersPaginated(skip: number, limit: number): Promise<PaginatedUsersResult>;
  updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser | null>;
  setPasswordAndClearResetToken(
    userId: string,
    hashedPassword: string
  ): Promise<IUser | null>;
  deleteUser(userId: string): Promise<boolean | null>;
}

export class UserRepository implements IUserRepository {
  async getUserById(userId: string): Promise<IUser | null> {
    const user = await UserModel.findById(userId).select("-password");
    return user;
  }

  async getAllUsers(): Promise<IUser[]> {
    const users = await UserModel.find().select("-password");
    return users;
  }

  async findAllPaginated(
    page: number,
    limit: number
  ): Promise<PaginatedUsersResult> {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      UserModel.find().select("-password").skip(skip).limit(limit).lean(),
      UserModel.countDocuments(),
    ]);
    return { users: users as IUser[], total };
  }

  async getUsersPaginated(
    skip: number,
    limit: number
  ): Promise<PaginatedUsersResult> {
    const [users, total] = await Promise.all([
      UserModel.find().select("-password").skip(skip).limit(limit).lean(),
      UserModel.countDocuments(),
    ]);
    return { users: users as IUser[], total };
  }

  async updateUser(
    userId: string,
    updateData: Partial<IUser>
  ): Promise<IUser | null> {
    const updateUser = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");
    return updateUser;
  }

  async setPasswordAndClearResetToken(
    userId: string,
    hashedPassword: string
  ): Promise<IUser | null> {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      {
        password: hashedPassword,
        $unset: { resetPasswordToken: 1, resetPasswordExpires: 1 },
      },
      { new: true }
    ).select("-password");
    return user;
  }

  async deleteUser(userId: string): Promise<boolean | null> {
    const result = await UserModel.findByIdAndDelete(userId);
    return result ? true : false;
  }

  async createUser(userData: Partial<IUser>): Promise<IUser> {
    const user = new UserModel(userData);
    await user.save();
    return user;
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    const user = await UserModel.findOne({ email: email });
    return user;
  }

  async getUserByResetToken(token: string): Promise<IUser | null> {
    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });
    return user;
  }
}

