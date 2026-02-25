import { AuthController } from "../controllers/auth.controller";
import { Router } from "express";
import {
  authorizedMiddleware,
  selfOrAdminMiddleware,
  adminMiddleware,
} from "../middlewares/authorized.middleware";
import { uploads } from "../middlewares/upload.middleware";

const authController = new AuthController();
const router = Router();

router.post("/register", authController.createUser);
router.post("/login", authController.loginUser);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

router.get("/whoami", authorizedMiddleware, authController.getProfile);
router.put(
  "/update-profile",
  authorizedMiddleware,
  uploads.single("image"),
  authController.updateProfile
);

router.get(
  "/:id",
  authorizedMiddleware,
  selfOrAdminMiddleware,
  authController.getOneUser
);
router.get(
  "/",
  authorizedMiddleware,
  adminMiddleware,
  authController.getAllUsers
);
router.put(
  "/:id",
  authorizedMiddleware,
  selfOrAdminMiddleware,
  uploads.single("image"),
  authController.updateUserById
);
router.delete(
  "/:id",
  authorizedMiddleware,
  selfOrAdminMiddleware,
  authController.deleteUser
);

export default router;

