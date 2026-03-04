import { Router } from "express";
import { listActiveRewards } from "../controllers/rewards.controller";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";

const router = Router();

router.get("/", authorizedMiddleware, listActiveRewards);

export default router;
