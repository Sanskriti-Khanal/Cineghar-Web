import { Router } from "express";
import { LoyaltyController } from "../controllers/loyalty.controller";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";

const router = Router();
const controller = new LoyaltyController();

router.get(
  "/me",
  authorizedMiddleware,
  controller.getMyPoints.bind(controller)
);

export default router;

