"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rewards_controller_1 = require("../controllers/rewards.controller");
const authorized_middleware_1 = require("../middlewares/authorized.middleware");
const router = (0, express_1.Router)();
router.get("/", authorized_middleware_1.authorizedMiddleware, rewards_controller_1.listActiveRewards);
exports.default = router;
