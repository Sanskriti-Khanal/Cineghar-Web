"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const configs_1 = require("../configs");
const connectDb = async () => {
    try {
        await mongoose_1.default.connect(configs_1.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000, // fail after 10s if can't connect
        });
        if (process.env.NODE_ENV !== "test") {
            console.log("Connected to MongoDB");
        }
    }
    catch (e) {
        if (process.env.NODE_ENV === "test") {
            console.error("MongoDB connection failed (is MongoDB running or is MONGODB_URI correct?):", e.message);
        }
        else {
            console.log("MongoDB error: ", e);
        }
        process.exit(1);
    }
};
exports.connectDb = connectDb;
