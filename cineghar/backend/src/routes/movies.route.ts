import { Router } from "express";
import { MoviesController } from "../controllers/movies.controller";

const router = Router();
const moviesController = new MoviesController();

router.get("/", moviesController.list.bind(moviesController));
router.get("/:id", moviesController.getOne.bind(moviesController));

export default router;
