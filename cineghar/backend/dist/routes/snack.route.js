"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const snack_controller_1 = require("../controllers/snack.controller");
const router = (0, express_1.Router)();
const controller = new snack_controller_1.SnackController();
router.get("/items", controller.listItems.bind(controller));
router.get("/combos", controller.listCombos.bind(controller));
exports.default = router;
