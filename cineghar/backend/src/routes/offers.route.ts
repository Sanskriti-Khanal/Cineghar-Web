import { Router } from "express";
import { listActiveOffers } from "../controllers/offers.controller";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";

const router = Router();

router.get("/", authorizedMiddleware, listActiveOffers);

export default router;
