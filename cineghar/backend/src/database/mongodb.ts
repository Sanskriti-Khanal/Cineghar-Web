import mongoose from "mongoose";
import { MONGODB_URI } from "../configs";

export const connectDb = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // fail after 10s if can't connect
    });
    if (process.env.NODE_ENV !== "test") {
      console.log("Connected to MongoDB");
    }
  } catch (e) {
    if (process.env.NODE_ENV === "test") {
      console.error("MongoDB connection failed (is MongoDB running or is MONGODB_URI correct?):", (e as Error).message);
    } else {
      console.log("MongoDB error: ", e);
    }
    process.exit(1);
  }
};

