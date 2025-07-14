import { config } from "dotenv";
import express from "express";
import { router as userRouter } from "./routes/authentication.js";

config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/auth/", userRouter);

app.get("/", (req, res) => {
  res.send({ message: "Welcome to the Firebase Auth Backend!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
