"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("../app"));
const mongodb_1 = require("../database/mongodb");
const user_model_1 = require("../models/user.model");
describe("Auth integration tests", () => {
    beforeAll(async () => {
        await (0, mongodb_1.connectDb)();
    }, 30000);
    afterAll(async () => {
        await mongoose_1.default.disconnect();
    }, 15000);
    beforeEach(async () => {
        await user_model_1.UserModel.deleteMany({});
    });
    describe("POST /api/auth/register", () => {
        it("register works", async () => {
            const res = await (0, supertest_1.default)(app_1.default)
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
        it("register fails - password mismatch", async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/register")
                .send({
                name: "Mismatch User",
                email: "mismatch@example.com",
                password: "password123",
                confirmPassword: "password456",
            })
                .expect(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBeDefined();
        });
        it("register fails - duplicate email", async () => {
            await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/register")
                .send({
                name: "First User",
                email: "duplicate@example.com",
                password: "password123",
                confirmPassword: "password123",
            })
                .expect(201);
            const res = await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/register")
                .send({
                name: "Second User",
                email: "duplicate@example.com",
                password: "password123",
                confirmPassword: "password123",
            })
                .expect(409);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/already|duplicate|in use/i);
        });
        it("register fails - invalid email format", async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/register")
                .send({
                name: "Invalid Email",
                email: "notanemail",
                password: "password123",
                confirmPassword: "password123",
            })
                .expect(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBeDefined();
        });
        it("register fails - password too short", async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/register")
                .send({
                name: "Short Pass",
                email: "short@example.com",
                password: "12345",
                confirmPassword: "12345",
            })
                .expect(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBeDefined();
        });
        it("register fails - name too short", async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/register")
                .send({
                name: "A",
                email: "shortname@example.com",
                password: "password123",
                confirmPassword: "password123",
            })
                .expect(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBeDefined();
        });
    });
    describe("POST /api/auth/login", () => {
        it("login works after register", async () => {
            await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/register")
                .send({
                name: "Login Test",
                email: "login@example.com",
                password: "secret456",
                confirmPassword: "secret456",
            })
                .expect(201);
            const res = await (0, supertest_1.default)(app_1.default)
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
            await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/register")
                .send({
                name: "Wrong Pass User",
                email: "wrongpass@example.com",
                password: "correct123",
                confirmPassword: "correct123",
            })
                .expect(201);
            const res = await (0, supertest_1.default)(app_1.default)
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
            const res = await (0, supertest_1.default)(app_1.default)
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
    describe("POST /api/auth/forgot-password", () => {
        it("valid email returns success", async () => {
            // Register a user first
            await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/register")
                .send({
                name: "Forgot Password User",
                email: "forgot@example.com",
                password: "password123",
                confirmPassword: "password123",
            })
                .expect(201);
            const res = await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/forgot-password")
                .send({
                email: "forgot@example.com",
            })
                .expect(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toMatch(/password reset instructions/i);
        });
        it("valid email format returns success even if email doesn't exist", async () => {
            // Test that API doesn't leak whether email exists
            const res = await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/forgot-password")
                .send({
                email: "nonexistent@example.com",
            })
                .expect(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toMatch(/password reset instructions/i);
        });
        it("invalid email returns error - not an email format", async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/forgot-password")
                .send({
                email: "notanemail",
            })
                .expect(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBeDefined();
        });
        it("invalid email returns error - missing email field", async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/forgot-password")
                .send({})
                .expect(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBeDefined();
        });
        it("invalid email returns error - empty string", async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/forgot-password")
                .send({
                email: "",
            })
                .expect(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBeDefined();
        });
    });
    describe("POST /api/auth/reset-password", () => {
        it("valid token resets password", async () => {
            // Register user
            await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/register")
                .send({
                name: "Reset Password User",
                email: "reset@example.com",
                password: "oldpassword",
                confirmPassword: "oldpassword",
            })
                .expect(201);
            // Request password reset
            await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/forgot-password")
                .send({
                email: "reset@example.com",
            })
                .expect(200);
            // Get token from DB
            const user = await user_model_1.UserModel.findOne({ email: "reset@example.com" });
            expect(user).toBeDefined();
            expect(user?.resetPasswordToken).toBeDefined();
            const token = user.resetPasswordToken;
            // Reset password with valid token
            const res = await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/reset-password")
                .send({
                token: token,
                password: "newpassword123",
                confirmPassword: "newpassword123",
            })
                .expect(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toMatch(/password.*reset.*success/i);
            // Verify can login with new password
            const loginRes = await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/login")
                .send({
                email: "reset@example.com",
                password: "newpassword123",
            })
                .expect(200);
            expect(loginRes.body.success).toBe(true);
            expect(loginRes.body.token).toBeDefined();
            // Verify old password doesn't work
            await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/login")
                .send({
                email: "reset@example.com",
                password: "oldpassword",
            })
                .expect(401);
            // Verify token was cleared (can't reuse)
            const reuseRes = await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/reset-password")
                .send({
                token: token,
                password: "anotherpassword",
                confirmPassword: "anotherpassword",
            })
                .expect(400);
            expect(reuseRes.body.success).toBe(false);
            expect(reuseRes.body.message).toMatch(/invalid|expired/i);
        });
        it("expired token rejected", async () => {
            // Register user
            await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/register")
                .send({
                name: "Expired Token User",
                email: "expired@example.com",
                password: "password123",
                confirmPassword: "password123",
            })
                .expect(201);
            // Request password reset
            await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/forgot-password")
                .send({
                email: "expired@example.com",
            })
                .expect(200);
            // Get token and manually expire it
            const user = await user_model_1.UserModel.findOne({ email: "expired@example.com" });
            expect(user).toBeDefined();
            const token = user.resetPasswordToken;
            // Set expiry to past
            await user_model_1.UserModel.findByIdAndUpdate(user._id, {
                resetPasswordExpires: new Date(Date.now() - 1000), // 1 second ago
            });
            // Try to reset with expired token
            const res = await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/reset-password")
                .send({
                token: token,
                password: "newpassword123",
                confirmPassword: "newpassword123",
            })
                .expect(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/invalid|expired/i);
        });
        it("invalid token rejected", async () => {
            // Register user
            await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/register")
                .send({
                name: "Invalid Token User",
                email: "invalid@example.com",
                password: "password123",
                confirmPassword: "password123",
            })
                .expect(201);
            // Try to reset with random/invalid token
            const res = await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/reset-password")
                .send({
                token: "invalid-token-that-does-not-exist",
                password: "newpassword123",
                confirmPassword: "newpassword123",
            })
                .expect(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/invalid|expired/i);
        });
    });
    describe("User CRUD", () => {
        it("get user by ID works", async () => {
            const registerRes = await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/register")
                .send({
                name: "CRUD User",
                email: "crud@example.com",
                password: "pass123",
                confirmPassword: "pass123",
            })
                .expect(201);
            const userId = registerRes.body.data._id;
            const res = await (0, supertest_1.default)(app_1.default)
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
            await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/register")
                .send({
                name: "Original Name",
                email: "update@example.com",
                password: "pass123",
                confirmPassword: "pass123",
            })
                .expect(201);
            const loginRes = await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/login")
                .send({ email: "update@example.com", password: "pass123" })
                .expect(200);
            const token = loginRes.body.token;
            const userId = loginRes.body.data._id;
            const res = await (0, supertest_1.default)(app_1.default)
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
            const registerRes = await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/register")
                .send({
                name: "To Delete",
                email: "delete@example.com",
                password: "pass123",
                confirmPassword: "pass123",
            })
                .expect(201);
            const userId = registerRes.body.data._id;
            await (0, supertest_1.default)(app_1.default)
                .delete(`/api/auth/${userId}`)
                .expect(200);
            const getRes = await (0, supertest_1.default)(app_1.default)
                .get(`/api/auth/${userId}`)
                .expect(404);
            expect(getRes.body.success).toBe(false);
            expect(getRes.body.message).toMatch(/not found/i);
        });
    });
    describe("Pagination", () => {
        let adminToken;
        const TOTAL_USERS = 15;
        const LIMIT = 5;
        beforeEach(async () => {
            // Create admin user
            const registerRes = await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/register")
                .send({
                name: "Admin",
                email: "admin@pagination.com",
                password: "admin123",
                confirmPassword: "admin123",
            });
            // Update role to admin in DB
            await user_model_1.UserModel.findByIdAndUpdate(registerRes.body.data._id, {
                role: "admin",
            });
            const loginRes = await (0, supertest_1.default)(app_1.default)
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
            await user_model_1.UserModel.insertMany(users);
        });
        it("page 1 returns limit users", async () => {
            const res = await (0, supertest_1.default)(app_1.default)
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
            const res = await (0, supertest_1.default)(app_1.default)
                .get("/api/admin/users")
                .query({ page: 1, limit: LIMIT })
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200);
            expect(res.body.totalUsers).toBe(TOTAL_USERS + 1); // +1 for admin user
            expect(res.body.totalPages).toBe(Math.ceil((TOTAL_USERS + 1) / LIMIT));
            expect(res.body.totalPages).toBe(4); // 16 users / 5 per page = 4 pages
        });
        it("invalid page handled - page 0", async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .get("/api/admin/users")
                .query({ page: 0, limit: LIMIT })
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBeDefined();
        });
        it("invalid page handled - negative page", async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .get("/api/admin/users")
                .query({ page: -1, limit: LIMIT })
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBeDefined();
        });
        it("invalid page handled - page beyond total pages", async () => {
            const res = await (0, supertest_1.default)(app_1.default)
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
    describe("Admin User Management", () => {
        let adminToken;
        let adminUserId;
        let regularUserToken;
        let regularUserId;
        beforeEach(async () => {
            // Create admin user
            const adminRegister = await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/register")
                .send({
                name: "Admin User",
                email: "admin@test.com",
                password: "admin123",
                confirmPassword: "admin123",
            });
            await user_model_1.UserModel.findByIdAndUpdate(adminRegister.body.data._id, {
                role: "admin",
            });
            const adminLogin = await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/login")
                .send({
                email: "admin@test.com",
                password: "admin123",
            });
            adminToken = adminLogin.body.token;
            adminUserId = adminLogin.body.data._id;
            // Create regular user
            const userRegister = await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/register")
                .send({
                name: "Regular User",
                email: "user@test.com",
                password: "user123",
                confirmPassword: "user123",
            });
            const userLogin = await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/login")
                .send({
                email: "user@test.com",
                password: "user123",
            });
            regularUserToken = userLogin.body.token;
            regularUserId = userLogin.body.data._id;
        });
        it("admin can create user", async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post("/api/admin/users")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                name: "New User",
                email: "newuser@test.com",
                password: "password123",
                confirmPassword: "password123",
            })
                .expect(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBeDefined();
            expect(res.body.data.email).toBe("newuser@test.com");
            expect(res.body.data.name).toBe("New User");
            expect(res.body.data.password).toBeUndefined();
        });
        it("admin can get user by ID", async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .get(`/api/admin/users/${regularUserId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBeDefined();
            expect(res.body.data._id).toBe(regularUserId);
            expect(res.body.data.email).toBe("user@test.com");
        });
        it("admin can update user", async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .put(`/api/admin/users/${regularUserId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                name: "Updated Name",
                email: "updated@test.com",
            })
                .expect(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.name).toBe("Updated Name");
            expect(res.body.data.email).toBe("updated@test.com");
        });
        it("admin can delete user", async () => {
            await (0, supertest_1.default)(app_1.default)
                .delete(`/api/admin/users/${regularUserId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200);
            // Verify user is deleted
            const getRes = await (0, supertest_1.default)(app_1.default)
                .get(`/api/admin/users/${regularUserId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(404);
            expect(getRes.body.success).toBe(false);
        });
        it("non-admin cannot access admin routes", async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .get("/api/admin/users")
                .set("Authorization", `Bearer ${regularUserToken}`)
                .expect(403);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/unauthorized|admin/i);
        });
        it("unauthorized request without token fails", async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .get("/api/admin/users")
                .expect(401);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/unauthorized|token/i);
        });
    });
    describe("GET /api/auth/whoami", () => {
        it("returns user profile with valid token", async () => {
            await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/register")
                .send({
                name: "Profile User",
                email: "profile@example.com",
                password: "password123",
                confirmPassword: "password123",
            })
                .expect(201);
            const loginRes = await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/login")
                .send({
                email: "profile@example.com",
                password: "password123",
            })
                .expect(200);
            const token = loginRes.body.token;
            const res = await (0, supertest_1.default)(app_1.default)
                .get("/api/auth/whoami")
                .set("Authorization", `Bearer ${token}`)
                .expect(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBeDefined();
            expect(res.body.data.email).toBe("profile@example.com");
            expect(res.body.data.name).toBe("Profile User");
            expect(res.body.data.password).toBeUndefined();
        });
        it("fails without token", async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .get("/api/auth/whoami")
                .expect(401);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/unauthorized|token/i);
        });
        it("fails with invalid token", async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .get("/api/auth/whoami")
                .set("Authorization", "Bearer invalid-token-here")
                .expect(401);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/unauthorized|invalid|malformed|token/i);
        });
    });
    describe("POST /api/auth/reset-password - edge cases", () => {
        it("fails when passwords don't match", async () => {
            // Register user
            await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/register")
                .send({
                name: "Mismatch User",
                email: "mismatch@example.com",
                password: "oldpassword",
                confirmPassword: "oldpassword",
            })
                .expect(201);
            // Request password reset
            await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/forgot-password")
                .send({
                email: "mismatch@example.com",
            })
                .expect(200);
            // Get token from DB
            const user = await user_model_1.UserModel.findOne({ email: "mismatch@example.com" });
            const token = user.resetPasswordToken;
            // Try to reset with mismatched passwords
            const res = await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/reset-password")
                .send({
                token: token,
                password: "newpassword123",
                confirmPassword: "differentpassword",
            })
                .expect(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBeDefined();
        });
        it("fails when password is too short", async () => {
            // Register user
            await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/register")
                .send({
                name: "Short Pass User",
                email: "shortpass@example.com",
                password: "oldpassword",
                confirmPassword: "oldpassword",
            })
                .expect(201);
            // Request password reset
            await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/forgot-password")
                .send({
                email: "shortpass@example.com",
            })
                .expect(200);
            // Get token from DB
            const user = await user_model_1.UserModel.findOne({ email: "shortpass@example.com" });
            const token = user.resetPasswordToken;
            // Try to reset with short password
            const res = await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/reset-password")
                .send({
                token: token,
                password: "12345",
                confirmPassword: "12345",
            })
                .expect(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBeDefined();
        });
    });
});
