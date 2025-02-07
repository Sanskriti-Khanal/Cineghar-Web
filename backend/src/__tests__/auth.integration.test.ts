import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import { connectDb } from "../database/mongodb";
import { UserModel } from "../models/user.model";

describe("Auth integration tests", () => {
  beforeAll(async () => {
    await connectDb();
  }, 15000);

  afterAll(async () => {
    await mongoose.disconnect();
  }, 10000);

  beforeEach(async () => {
    await UserModel.deleteMany({});
  });

  describe("POST /api/auth/register", () => {
    it("register works", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Test User",
          email: "test@example.com",
          password: "password123",
          confirmPassword: "password123",
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Register Successful");
      expect(res.body.data).toBeDefined();
      expect(res.body.data.email).toBe("test@example.com");
      expect(res.body.data.name).toBe("Test User");
      expect(res.body.data.password).toBeUndefined();
      expect(res.body.data._id).toBeDefined();
    });
  });

  describe("POST /api/auth/login", () => {
    it("login works after register", async () => {
      await request(app)
        .post("/api/auth/register")
        .send({
          name: "Login Test",
          email: "login@example.com",
          password: "secret456",
          confirmPassword: "secret456",
        })
        .expect(201);

      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "login@example.com",
          password: "secret456",
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Login successful");
      expect(res.body.token).toBeDefined();
      expect(typeof res.body.token).toBe("string");
      expect(res.body.data).toBeDefined();
      expect(res.body.data.email).toBe("login@example.com");
      expect(res.body.data.password).toBeUndefined();
    });

    it("invalid login fails - wrong password", async () => {
      await request(app)
        .post("/api/auth/register")
        .send({
          name: "Wrong Pass User",
          email: "wrongpass@example.com",
          password: "correct123",
          confirmPassword: "correct123",
        })
        .expect(201);

      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "wrongpass@example.com",
          password: "wrongpassword",
        })
        .expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/invalid|credentials/i);
    });

    it("invalid login fails - email not found", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: "anypassword",
        })
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/not found/i);
    });
  });
});
