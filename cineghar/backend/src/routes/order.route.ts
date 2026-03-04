import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";

const router = Router();
const controller = new OrderController();

router.get("/", authorizedMiddleware, controller.getMyOrders.bind(controller));

export default router;
