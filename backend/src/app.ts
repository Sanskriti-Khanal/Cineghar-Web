import express, { Application, Request, Response } from "express";
import cors from "cors";
import path from "path";
import authRoute from "./routes/auth.route";
import adminAuthRoute from "./routes/admin/auth.route";
import adminUserRoute from "./routes/admin/user.route";

const app: Application = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5050"],
    credentials: true,
  })
);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoute);
app.use("/api/admin/auth", adminAuthRoute);
app.use("/api/admin/users", adminUserRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("CineGhar API Server");
});

export default app;
