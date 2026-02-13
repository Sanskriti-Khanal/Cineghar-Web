"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../../controllers/admin/auth.controller");
const authorized_middleware_1 = require("../../middlewares/authorized.middleware");
const upload_middleware_1 = require("../../middlewares/upload.middleware");
const router = (0, express_1.Router)();
const adminUserController = new auth_controller_1.AdminUserController();
// POST /api/admin/users - create user with optional image (Multer)
router.post("/", authorized_middleware_1.authorizedMiddleware, authorized_middleware_1.adminMiddleware, upload_middleware_1.uploads.single("image"), adminUserController.createUser.bind(adminUserController));
// GET /api/admin/users
router.get("/", authorized_middleware_1.authorizedMiddleware, authorized_middleware_1.adminMiddleware, adminUserController.getAllUsers.bind(adminUserController));
// GET /api/admin/users/:id
router.get("/:id", authorized_middleware_1.authorizedMiddleware, authorized_middleware_1.adminMiddleware, adminUserController.getOneUser.bind(adminUserController));
// PUT /api/admin/users/:id - update with optional image (Multer)
router.put("/:id", authorized_middleware_1.authorizedMiddleware, authorized_middleware_1.adminMiddleware, upload_middleware_1.uploads.single("image"), adminUserController.updateUser.bind(adminUserController));
// DELETE /api/admin/users/:id
router.delete("/:id", authorized_middleware_1.authorizedMiddleware, authorized_middleware_1.adminMiddleware, adminUserController.deleteUser.bind(adminUserController));
exports.default = router;
