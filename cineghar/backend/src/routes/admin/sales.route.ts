import { Router } from "express";
import { AdminSalesController } from "../../controllers/admin/sales.controller";
import {
  authorizedMiddleware,
  adminMiddleware,
} from "../../middlewares/authorized.middleware";

const router = Router();
const controller = new AdminSalesController();

router.get(
  "/summary",
  authorizedMiddleware,
  adminMiddleware,
  controller.summary.bind(controller)
);

export default router;

