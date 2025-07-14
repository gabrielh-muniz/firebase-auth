import { Router } from "express";
import { verifyTokenId } from "../middlewares/auth.js";

export const router = Router();

router.post("/register", verifyTokenId, (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  // TODO: create a user in firebase and the database

  // TODO: send a verification email
});
