import { Router } from "express";
import { MovieController } from "../controllers/movie.controller";

const router = Router();
const movieController = new MovieController();

// Popular movies
router.get("/popular", (req, res) => {
  movieController.getPopularMovies(req, res);
});

// Upcoming movies
router.get("/upcoming", (req, res) => {
  movieController.getUpcomingMovies(req, res);
});

// Search movies
router.get("/search", (req, res) => {
  movieController.searchMovies(req, res);
});

// Movie details
router.get("/:id", (req, res) => {
  movieController.getMovieDetails(req, res);
});

export default router;
