import { Router } from "express";
import { AdminDashboardController } from "../../controllers/admin/dashboard.controller";
import {
  authorizedMiddleware,
  adminMiddleware,
} from "../../middlewares/authorized.middleware";

const router = Router();
const controller = new AdminDashboardController();

router.get(
  "/stats",
  authorizedMiddleware,
  adminMiddleware,
  controller.stats.bind(controller)
);

router.get(
  "/orders",
  authorizedMiddleware,
  adminMiddleware,
  controller.recentOrders.bind(controller)
);

export default router;
