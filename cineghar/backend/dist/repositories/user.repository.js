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
    async updateUser(userId, updateData) {
        const updateUser = await user_model_1.UserModel.findByIdAndUpdate(userId, updateData, {
            new: true,
        }).select("-password");
        return updateUser;
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
}
exports.UserRepository = UserRepository;
