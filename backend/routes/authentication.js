import { Router } from "express";

export const router = Router();

router.get("/create-user", (req, res) => {
  res.send({ message: "Create user endpoint" });
});
