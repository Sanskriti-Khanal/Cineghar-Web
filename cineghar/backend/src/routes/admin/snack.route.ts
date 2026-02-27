import { Router } from "express";
import { AdminSnackController } from "../../controllers/admin/snack.controller";
import {
  authorizedMiddleware,
  adminMiddleware,
} from "../../middlewares/authorized.middleware";
import { uploads } from "../../middlewares/upload.middleware";

const router = Router();
const controller = new AdminSnackController();

// Snack items
router.get(
  "/items",
  authorizedMiddleware,
  adminMiddleware,
  controller.listItems.bind(controller)
);

router.get(
  "/items/:id",
  authorizedMiddleware,
  adminMiddleware,
  controller.getItem.bind(controller)
);

router.post(
  "/items",
  authorizedMiddleware,
  adminMiddleware,
  uploads.single("image"),
  controller.createItem.bind(controller)
);

router.put(
  "/items/:id",
  authorizedMiddleware,
  adminMiddleware,
  uploads.single("image"),
  controller.updateItem.bind(controller)
);

router.delete(
  "/items/:id",
  authorizedMiddleware,
  adminMiddleware,
  controller.deleteItem.bind(controller)
);

// Snack combos
router.get(
  "/combos",
  authorizedMiddleware,
  adminMiddleware,
  controller.listCombos.bind(controller)
);

router.get(
  "/combos/:id",
  authorizedMiddleware,
  adminMiddleware,
  controller.getCombo.bind(controller)
);

router.post(
  "/combos",
  authorizedMiddleware,
  adminMiddleware,
  uploads.single("image"),
  controller.createCombo.bind(controller)
);

router.put(
  "/combos/:id",
  authorizedMiddleware,
  adminMiddleware,
  uploads.single("image"),
  controller.updateCombo.bind(controller)
);

router.delete(
  "/combos/:id",
  authorizedMiddleware,
  adminMiddleware,
  controller.deleteCombo.bind(controller)
);

export default router;

