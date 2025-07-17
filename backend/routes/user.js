import { Router } from "express";
import { query } from "../db/connection.js";
import { catchError } from "../utils/errorHandler.js";
import { verifyTokenId, verifyUserRole } from "../middlewares/auth.js";

export const router = Router();

router.get("/users", verifyTokenId, verifyUserRole, async (req, res) => {
  const { uid } = req.user;

  const [error, users] = await catchError(
    query("SELECT * FROM users WHERE uid != $1", [uid])
  );
  if (error) {
    console.error("Database query error:", error);
    return res
      .status(500)
      .json({ message: `Internal server error: ${error.message}` });
  }
  return res.status(200).json(users.rows);
});
