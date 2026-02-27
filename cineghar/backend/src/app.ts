import express, { Application, Request, Response } from "express";
import cors from "cors";
import path from "path";
import authRoute from "./routes/auth.route";
import adminAuthRoute from "./routes/admin/auth.route";
import adminUserRoute from "./routes/admin/user.route";
import adminMovieRoute from "./routes/admin/movie.route";
import adminHallRoute from "./routes/admin/hall.route";
import adminShowtimeRoute from "./routes/admin/showtime.route";
import adminSalesRoute from "./routes/admin/sales.route";
import adminLoyaltyRoute from "./routes/admin/loyalty.route";
import adminOfferRoute from "./routes/admin/offer.route";
import adminRewardRoute from "./routes/admin/reward.route";
import adminSnackRoute from "./routes/admin/snack.route";
import paymentRoute from "./routes/payment.route";
import moviesRoute from "./routes/movies.route";
import bookingRoute from "./routes/booking.route";
import loyaltyRoute from "./routes/loyalty.route";
import snackRoute from "./routes/snack.route";

const app: Application = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5050",
      process.env.FRONTEND_URL || "http://localhost:3000",
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "",
      process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : "",
    ].filter(Boolean),
    credentials: true,
  })
);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoute);
app.use("/api/admin/auth", adminAuthRoute);
app.use("/api/admin/users", adminUserRoute);
app.use("/api/admin/movies", adminMovieRoute);
app.use("/api/admin/halls", adminHallRoute);
app.use("/api/admin/showtimes", adminShowtimeRoute);
app.use("/api/admin/sales", adminSalesRoute);
app.use("/api/admin/loyalty", adminLoyaltyRoute);
app.use("/api/admin/offers", adminOfferRoute);
app.use("/api/admin/rewards", adminRewardRoute);
app.use("/api/admin/snacks", adminSnackRoute);
app.use("/api/movies", moviesRoute);
app.use("/api/booking", bookingRoute);
app.use("/api/loyalty", loyaltyRoute);
app.use("/api/snacks", snackRoute);
app.use("/api/payment", paymentRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("CineGhar API Server");
});

export default app;
