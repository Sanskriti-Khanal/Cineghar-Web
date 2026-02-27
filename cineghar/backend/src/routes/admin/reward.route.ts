import { Router } from "express";
import { AdminRewardController } from "../../controllers/admin/reward.controller";
import {
  authorizedMiddleware,
  adminMiddleware,
} from "../../middlewares/authorized.middleware";

const router = Router();
const controller = new AdminRewardController();

router.get(
  "/",
  authorizedMiddleware,
  adminMiddleware,
  controller.list.bind(controller)
);

router.get(
  "/:id",
  authorizedMiddleware,
  adminMiddleware,
  controller.getOne.bind(controller)
);

router.post(
  "/",
  authorizedMiddleware,
  adminMiddleware,
  controller.create.bind(controller)
);

router.put(
  "/:id",
  authorizedMiddleware,
  adminMiddleware,
  controller.update.bind(controller)
);

router.delete(
  "/:id",
  authorizedMiddleware,
  adminMiddleware,
  controller.remove.bind(controller)
);

export default router;

