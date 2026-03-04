"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const offers_controller_1 = require("../controllers/offers.controller");
const authorized_middleware_1 = require("../middlewares/authorized.middleware");
const router = (0, express_1.Router)();
router.get("/", authorized_middleware_1.authorizedMiddleware, offers_controller_1.listActiveOffers);
exports.default = router;
