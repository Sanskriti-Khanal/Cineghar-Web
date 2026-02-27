import { Router } from "express";
import { SnackController } from "../controllers/snack.controller";

const router = Router();
const controller = new SnackController();

router.get("/items", controller.listItems.bind(controller));
router.get("/combos", controller.listCombos.bind(controller));

export default router;

