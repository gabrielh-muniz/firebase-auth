import { Router } from "express";
import { verifyTokenId, verifyUserRole } from "../middlewares/auth.js";
import {
  createUser,
  getCurrentUserRole,
} from "../controllers/authentication.js";

export const router = Router();

router.post("/register", verifyTokenId, verifyUserRole, createUser);

router.get("/me", verifyTokenId, getCurrentUserRole);
