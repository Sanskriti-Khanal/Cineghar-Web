import { Router } from "express";
import { AdminMovieController } from "../../controllers/admin/movie.controller";
import {
  authorizedMiddleware,
  adminMiddleware,
} from "../../middlewares/authorized.middleware";
import { uploads } from "../../middlewares/upload.middleware";

const router = Router();
const adminMovieController = new AdminMovieController();

router.post(
  "/",
  authorizedMiddleware,
  adminMiddleware,
  uploads.single("poster"),
  adminMovieController.create.bind(adminMovieController)
);

router.get(
  "/",
  authorizedMiddleware,
  adminMiddleware,
  adminMovieController.getAll.bind(adminMovieController)
);

router.get(
  "/:id",
  authorizedMiddleware,
  adminMiddleware,
  adminMovieController.getOne.bind(adminMovieController)
);

router.put(
  "/:id",
  authorizedMiddleware,
  adminMiddleware,
  uploads.single("poster"),
  adminMovieController.update.bind(adminMovieController)
);

router.delete(
  "/:id",
  authorizedMiddleware,
  adminMiddleware,
  adminMovieController.delete.bind(adminMovieController)
);

export default router;
