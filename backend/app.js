import { config } from "dotenv";
import express from "express";
import { router as userRouter } from "./routes/authentication.js";
import cors from "cors";

config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/auth", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
