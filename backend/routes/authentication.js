import { Router } from "express";
import { verifyTokenId } from "../middlewares/verifyTokenId.js";

export const router = Router();

router.get("/register", verifyTokenId, (req, res) => {
  res.send({ message: "Create user endpoint" });
});
