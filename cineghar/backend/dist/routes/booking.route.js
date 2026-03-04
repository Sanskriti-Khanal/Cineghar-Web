"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const booking_controller_1 = require("../controllers/booking.controller");
const authorized_middleware_1 = require("../middlewares/authorized.middleware");
const router = (0, express_1.Router)();
const bookingController = new booking_controller_1.BookingController();
// Public metadata
router.get("/cities", bookingController.getCities.bind(bookingController));
router.get("/halls", bookingController.getHalls.bind(bookingController));
router.get("/showtimes", bookingController.getShowtimes.bind(bookingController));
router.get("/showtimes/:id/seats", bookingController.getSeats.bind(bookingController));
// Authenticated actions
router.post("/holds", authorized_middleware_1.authorizedMiddleware, bookingController.holdSeats.bind(bookingController));
router.post("/confirm", authorized_middleware_1.authorizedMiddleware, bookingController.confirmBooking.bind(bookingController));
exports.default = router;
