"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const user_model_1 = require("../models/user.model");
class UserRepository {
    async getUserById(userId) {
        const user = await user_model_1.UserModel.findById(userId).select("-password");
        return user;
    }
    async getAllUsers() {
        const users = await user_model_1.UserModel.find().select("-password");
        return users;
    }
    async findAllPaginated(page, limit) {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            user_model_1.UserModel.find().select("-password").skip(skip).limit(limit).lean(),
            user_model_1.UserModel.countDocuments(),
        ]);
        return { users: users, total };
    }
    async getUsersPaginated(skip, limit) {
        const [users, total] = await Promise.all([
            user_model_1.UserModel.find().select("-password").skip(skip).limit(limit).lean(),
            user_model_1.UserModel.countDocuments(),
        ]);
        return { users: users, total };
    }
    async updateUser(userId, updateData) {
        const updateUser = await user_model_1.UserModel.findByIdAndUpdate(userId, updateData, {
            new: true,
        }).select("-password");
        return updateUser;
    }
    async setPasswordAndClearResetToken(userId, hashedPassword) {
        const user = await user_model_1.UserModel.findByIdAndUpdate(userId, {
            password: hashedPassword,
            $unset: { resetPasswordToken: 1, resetPasswordExpires: 1 },
        }, { new: true }).select("-password");
        return user;
    }
    async deleteUser(userId) {
        const result = await user_model_1.UserModel.findByIdAndDelete(userId);
        return result ? true : false;
    }
    async createUser(userData) {
        const user = new user_model_1.UserModel(userData);
        await user.save();
        return user;
    }
    async getUserByEmail(email) {
        const user = await user_model_1.UserModel.findOne({ email: email });
        return user;
    }
    async getUserByResetToken(token) {
        const user = await user_model_1.UserModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() },
        });
        return user;
    }
}
exports.UserRepository = UserRepository;
