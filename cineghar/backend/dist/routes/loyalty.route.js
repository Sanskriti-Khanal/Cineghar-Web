"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const loyalty_controller_1 = require("../controllers/loyalty.controller");
const authorized_middleware_1 = require("../middlewares/authorized.middleware");
const router = (0, express_1.Router)();
const controller = new loyalty_controller_1.LoyaltyController();
router.get("/me", authorized_middleware_1.authorizedMiddleware, controller.getMyPoints.bind(controller));
exports.default = router;
