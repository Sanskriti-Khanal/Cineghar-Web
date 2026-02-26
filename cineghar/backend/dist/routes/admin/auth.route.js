"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../../controllers/admin/auth.controller");
const authorized_middleware_1 = require("../../middlewares/authorized.middleware");
const router = (0, express_1.Router)();
const adminUserController = new auth_controller_1.AdminUserController();
// Test route
router.get("/test", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to admin routes",
    });
});
// CRUD routes - protected with admin middleware
router.post("/", authorized_middleware_1.authorizedMiddleware, authorized_middleware_1.adminMiddleware, adminUserController.createUser.bind(adminUserController));
router.get("/", authorized_middleware_1.authorizedMiddleware, authorized_middleware_1.adminMiddleware, adminUserController.getAllUsers.bind(adminUserController));
router.get("/:id", authorized_middleware_1.authorizedMiddleware, authorized_middleware_1.adminMiddleware, adminUserController.getOneUser.bind(adminUserController));
router.put("/:id", authorized_middleware_1.authorizedMiddleware, authorized_middleware_1.adminMiddleware, adminUserController.updateUser.bind(adminUserController));
router.delete("/:id", authorized_middleware_1.authorizedMiddleware, authorized_middleware_1.adminMiddleware, adminUserController.deleteUser.bind(adminUserController));
exports.default = router;
