import { AuthController } from "../controllers/auth.controller";
import { Router } from "express";
import {
  authorizedMiddleware,
  selfOrAdminMiddleware,
} from "../middlewares/authorized.middleware";
import { uploads } from "../middlewares/upload.middleware";

const authController = new AuthController();
const router = Router();

router.post("/register", authController.createUser);
router.post("/login", authController.loginUser);
router.post("/forgot-password", authController.forgotPassword);

router.get("/whoami", authorizedMiddleware, authController.getProfile);
router.put(
  "/update-profile",
  authorizedMiddleware,
  uploads.single("image"),
  authController.updateProfile
);

router.get("/:id", authController.getOneUser);
router.get("/", authController.getAllUsers);
router.put(
  "/:id",
  authorizedMiddleware,
  selfOrAdminMiddleware,
  uploads.single("image"),
  authController.updateUserById
);
router.delete("/:id", authController.deleteUser);

export default router;

