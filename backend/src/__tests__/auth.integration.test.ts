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

  describe("User CRUD", () => {
    it("get user by ID works", async () => {
      const registerRes = await request(app)
        .post("/api/auth/register")
        .send({
          name: "CRUD User",
          email: "crud@example.com",
          password: "pass123",
          confirmPassword: "pass123",
        })
        .expect(201);

      const userId = registerRes.body.data._id;
      const res = await request(app)
        .get(`/api/auth/${userId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(res.body.data._id).toBe(userId);
      expect(res.body.data.name).toBe("CRUD User");
      expect(res.body.data.email).toBe("crud@example.com");
      expect(res.body.data.password).toBeUndefined();
    });

    it("update user works (self)", async () => {
      await request(app)
        .post("/api/auth/register")
        .send({
          name: "Original Name",
          email: "update@example.com",
          password: "pass123",
          confirmPassword: "pass123",
        })
        .expect(201);

      const loginRes = await request(app)
        .post("/api/auth/login")
        .send({ email: "update@example.com", password: "pass123" })
        .expect(200);

      const token = loginRes.body.token;
      const userId = loginRes.body.data._id;

      const res = await request(app)
        .put(`/api/auth/${userId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Updated Name" })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe("Updated Name");
      expect(res.body.data.email).toBe("update@example.com");
      expect(res.body.data.password).toBeUndefined();
    });

    it("delete user works", async () => {
      const registerRes = await request(app)
        .post("/api/auth/register")
        .send({
          name: "To Delete",
          email: "delete@example.com",
          password: "pass123",
          confirmPassword: "pass123",
        })
        .expect(201);

      const userId = registerRes.body.data._id;

      await request(app)
        .delete(`/api/auth/${userId}`)
        .expect(200);

      const getRes = await request(app)
        .get(`/api/auth/${userId}`)
        .expect(404);

      expect(getRes.body.success).toBe(false);
      expect(getRes.body.message).toMatch(/not found/i);
    });
  });

  describe("Pagination", () => {
    let adminToken: string;
    const TOTAL_USERS = 15;
    const LIMIT = 5;

    beforeEach(async () => {
      // Create admin user
      const registerRes = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Admin",
          email: "admin@pagination.com",
          password: "admin123",
          confirmPassword: "admin123",
        });

      // Update role to admin in DB
      await UserModel.findByIdAndUpdate(registerRes.body.data._id, {
        role: "admin",
      });

      const loginRes = await request(app)
        .post("/api/auth/login")
        .send({
          email: "admin@pagination.com",
          password: "admin123",
        });

      adminToken = loginRes.body.token;

      // Create multiple users for pagination testing
      const users = [];
      for (let i = 1; i <= TOTAL_USERS; i++) {
        users.push({
          name: `User ${i}`,
          email: `user${i}@pagination.com`,
          password: "password123",
          role: "user",
        });
      }
      await UserModel.insertMany(users);
    });

    it("page 1 returns limit users", async () => {
      const res = await request(app)
        .get("/api/admin/users")
        .query({ page: 1, limit: LIMIT })
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(LIMIT);
      expect(res.body.page).toBe(1);
      expect(res.body.limit).toBe(LIMIT);
    });

    it("total pages calculation correct", async () => {
      const res = await request(app)
        .get("/api/admin/users")
        .query({ page: 1, limit: LIMIT })
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.totalUsers).toBe(TOTAL_USERS + 1); // +1 for admin user
      expect(res.body.totalPages).toBe(Math.ceil((TOTAL_USERS + 1) / LIMIT));
      expect(res.body.totalPages).toBe(4); // 16 users / 5 per page = 4 pages
    });

    it("invalid page handled - page 0", async () => {
      const res = await request(app)
        .get("/api/admin/users")
        .query({ page: 0, limit: LIMIT })
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBeDefined();
    });

    it("invalid page handled - negative page", async () => {
      const res = await request(app)
        .get("/api/admin/users")
        .query({ page: -1, limit: LIMIT })
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBeDefined();
    });

    it("invalid page handled - page beyond total pages", async () => {
      const res = await request(app)
        .get("/api/admin/users")
        .query({ page: 999, limit: LIMIT })
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      // Should return empty array, not error
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(0);
      expect(res.body.page).toBe(999);
    });
  });
});
