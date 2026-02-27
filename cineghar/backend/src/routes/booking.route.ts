import { Router } from "express";
import { BookingController } from "../controllers/booking.controller";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";

const router = Router();
const bookingController = new BookingController();

// Public metadata
router.get("/cities", bookingController.getCities.bind(bookingController));
router.get("/halls", bookingController.getHalls.bind(bookingController));
router.get(
  "/showtimes",
  bookingController.getShowtimes.bind(bookingController)
);
router.get(
  "/showtimes/:id/seats",
  bookingController.getSeats.bind(bookingController)
);

// Authenticated actions
router.post(
  "/holds",
  authorizedMiddleware,
  bookingController.holdSeats.bind(bookingController)
);
router.post(
  "/confirm",
  authorizedMiddleware,
  bookingController.confirmBooking.bind(bookingController)
);

export default router;

