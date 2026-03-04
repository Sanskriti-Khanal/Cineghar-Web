"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const movies_controller_1 = require("../controllers/movies.controller");
const router = (0, express_1.Router)();
const moviesController = new movies_controller_1.MoviesController();
router.get("/", moviesController.list.bind(moviesController));
router.get("/:id", moviesController.getOne.bind(moviesController));
exports.default = router;
