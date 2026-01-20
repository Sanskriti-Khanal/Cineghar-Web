import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import { PORT } from "./configs";
import { connectDb } from "./database/mongodb";
import authRoute from "./routes/auth.route";
import adminAuthRoute from "./routes/admin/auth.route";

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/admin/auth", adminAuthRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("CineGhar API Server");
});

async function startServer() {
  await connectDb();

  app.listen(PORT, () => {
    console.log(`Server: http://localhost:${PORT}`);
  });
}

startServer();

