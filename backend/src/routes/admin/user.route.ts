import { Router } from "express";
import { AdminUserController } from "../../controllers/admin/auth.controller";
import {
  authorizedMiddleware,
  adminMiddleware,
} from "../../middlewares/authorized.middleware";
import { uploads } from "../../middlewares/upload.middleware";

const router = Router();
const adminUserController = new AdminUserController();

// POST /api/admin/users - create user with optional image (Multer)
router.post(
  "/",
  authorizedMiddleware,
  adminMiddleware,
  uploads.single("image"),
  adminUserController.createUser.bind(adminUserController)
);

// GET /api/admin/users
router.get(
  "/",
  authorizedMiddleware,
  adminMiddleware,
  adminUserController.getAllUsers.bind(adminUserController)
);

// GET /api/admin/users/:id
router.get(
  "/:id",
  authorizedMiddleware,
  adminMiddleware,
  adminUserController.getOneUser.bind(adminUserController)
);

// PUT /api/admin/users/:id - update with optional image (Multer)
router.put(
  "/:id",
  authorizedMiddleware,
  adminMiddleware,
  uploads.single("image"),
  adminUserController.updateUser.bind(adminUserController)
);

// DELETE /api/admin/users/:id
router.delete(
  "/:id",
  authorizedMiddleware,
  adminMiddleware,
  adminUserController.deleteUser.bind(adminUserController)
);

export default router;
