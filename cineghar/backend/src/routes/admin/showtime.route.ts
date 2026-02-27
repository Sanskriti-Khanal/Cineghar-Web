import { Router } from "express";
import { AdminShowtimeController } from "../../controllers/admin/booking.controller";
import {
  authorizedMiddleware,
  adminMiddleware,
} from "../../middlewares/authorized.middleware";

const router = Router();
const controller = new AdminShowtimeController();

router.post(
  "/",
  authorizedMiddleware,
  adminMiddleware,
  controller.create.bind(controller)
);

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

