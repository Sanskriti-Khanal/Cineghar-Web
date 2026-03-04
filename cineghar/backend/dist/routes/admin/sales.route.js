"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sales_controller_1 = require("../../controllers/admin/sales.controller");
const authorized_middleware_1 = require("../../middlewares/authorized.middleware");
const router = (0, express_1.Router)();
const controller = new sales_controller_1.AdminSalesController();
router.get("/summary", authorized_middleware_1.authorizedMiddleware, authorized_middleware_1.adminMiddleware, controller.summary.bind(controller));
exports.default = router;
