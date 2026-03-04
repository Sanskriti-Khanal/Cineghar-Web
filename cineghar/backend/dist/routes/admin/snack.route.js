"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const snack_controller_1 = require("../../controllers/admin/snack.controller");
const authorized_middleware_1 = require("../../middlewares/authorized.middleware");
const upload_middleware_1 = require("../../middlewares/upload.middleware");
const router = (0, express_1.Router)();
const controller = new snack_controller_1.AdminSnackController();
// Snack items
router.get("/items", authorized_middleware_1.authorizedMiddleware, authorized_middleware_1.adminMiddleware, controller.listItems.bind(controller));
router.get("/items/:id", authorized_middleware_1.authorizedMiddleware, authorized_middleware_1.adminMiddleware, controller.getItem.bind(controller));
router.post("/items", authorized_middleware_1.authorizedMiddleware, authorized_middleware_1.adminMiddleware, upload_middleware_1.uploads.single("image"), controller.createItem.bind(controller));
router.put("/items/:id", authorized_middleware_1.authorizedMiddleware, authorized_middleware_1.adminMiddleware, upload_middleware_1.uploads.single("image"), controller.updateItem.bind(controller));
router.delete("/items/:id", authorized_middleware_1.authorizedMiddleware, authorized_middleware_1.adminMiddleware, controller.deleteItem.bind(controller));
// Snack combos
router.get("/combos", authorized_middleware_1.authorizedMiddleware, authorized_middleware_1.adminMiddleware, controller.listCombos.bind(controller));
router.get("/combos/:id", authorized_middleware_1.authorizedMiddleware, authorized_middleware_1.adminMiddleware, controller.getCombo.bind(controller));
router.post("/combos", authorized_middleware_1.authorizedMiddleware, authorized_middleware_1.adminMiddleware, upload_middleware_1.uploads.single("image"), controller.createCombo.bind(controller));
router.put("/combos/:id", authorized_middleware_1.authorizedMiddleware, authorized_middleware_1.adminMiddleware, upload_middleware_1.uploads.single("image"), controller.updateCombo.bind(controller));
router.delete("/combos/:id", authorized_middleware_1.authorizedMiddleware, authorized_middleware_1.adminMiddleware, controller.deleteCombo.bind(controller));
exports.default = router;
