"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../controllers/order.controller");
const authorized_middleware_1 = require("../middlewares/authorized.middleware");
const router = (0, express_1.Router)();
const controller = new order_controller_1.OrderController();
router.get("/", authorized_middleware_1.authorizedMiddleware, controller.getMyOrders.bind(controller));
exports.default = router;
