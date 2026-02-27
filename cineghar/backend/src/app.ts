import express, { Application, Request, Response } from "express";
import cors from "cors";
import path from "path";
import authRoute from "./routes/auth.route";
import adminAuthRoute from "./routes/admin/auth.route";
import adminUserRoute from "./routes/admin/user.route";
import adminMovieRoute from "./routes/admin/movie.route";
import adminHallRoute from "./routes/admin/hall.route";
import adminShowtimeRoute from "./routes/admin/showtime.route";
import moviesRoute from "./routes/movies.route";
import bookingRoute from "./routes/booking.route";

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
app.use("/api/movies", moviesRoute);
app.use("/api/booking", bookingRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("CineGhar API Server");
});

export default app;
