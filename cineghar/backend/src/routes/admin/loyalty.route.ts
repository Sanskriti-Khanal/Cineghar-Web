import { Router } from "express";
import { AdminLoyaltyController } from "../../controllers/admin/loyalty.controller";
import {
  authorizedMiddleware,
  adminMiddleware,
} from "../../middlewares/authorized.middleware";

const router = Router();
const controller = new AdminLoyaltyController();

router.get(
  "/users",
  authorizedMiddleware,
  adminMiddleware,
  controller.listUsers.bind(controller)
);

router.get(
  "/users/:id",
  authorizedMiddleware,
  adminMiddleware,
  controller.getUserHistory.bind(controller)
);

router.post(
  "/adjust",
  authorizedMiddleware,
  adminMiddleware,
  controller.adjustPoints.bind(controller)
);

router.get(
  "/rules",
  authorizedMiddleware,
  adminMiddleware,
  controller.listRules.bind(controller)
);

router.post(
  "/rules",
  authorizedMiddleware,
  adminMiddleware,
  controller.createRule.bind(controller)
);

router.put(
  "/rules/:id",
  authorizedMiddleware,
  adminMiddleware,
  controller.updateRule.bind(controller)
);

router.delete(
  "/rules/:id",
  authorizedMiddleware,
  adminMiddleware,
  controller.deleteRule.bind(controller)
);

export default router;

