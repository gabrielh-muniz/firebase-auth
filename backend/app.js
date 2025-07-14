import { config } from "dotenv";
import express from "express";
import { router as userRouter } from "./routes/authentication.js";
import { query } from "./db/connection.js";

config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/auth", userRouter);

app.get("/", async (req, res) => {
  const result = await query("SELECT NOW()");
  res.send({ date: `${result.rows[0].now}` });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
