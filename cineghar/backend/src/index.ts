import dotenv from "dotenv";
import { PORT } from "./configs";
import { connectDb } from "./database/mongodb";
import app from "./app";

dotenv.config();

async function startServer() {
  await connectDb();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server: http://0.0.0.0:${PORT}`);
  });
}

startServer();

