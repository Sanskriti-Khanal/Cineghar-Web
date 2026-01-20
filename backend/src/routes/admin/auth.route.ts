import { Router, Request, Response } from "express";
import { AdminUserController } from "../../controllers/admin/auth.controller";
import { authorizedMiddleware, adminMiddleware } from "../../middlewares/authorized.middleware";

const router = Router();
const adminUserController = new AdminUserController();

// Test route
router.get("/test", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to admin routes",
  });
});

// CRUD routes - protected with admin middleware
router.post(
  "/",
  authorizedMiddleware,
  adminMiddleware,
  adminUserController.createUser.bind(adminUserController)
);

router.get(
  "/",
  authorizedMiddleware,
  adminMiddleware,
  adminUserController.getAllUsers.bind(adminUserController)
);

router.get(
  "/:id",
  authorizedMiddleware,
  adminMiddleware,
  adminUserController.getOneUser.bind(adminUserController)
);

router.put(
  "/:id",
  authorizedMiddleware,
  adminMiddleware,
  adminUserController.updateUser.bind(adminUserController)
);

router.delete(
  "/:id",
  authorizedMiddleware,
  adminMiddleware,
  adminUserController.deleteUser.bind(adminUserController)
);

export default router;




