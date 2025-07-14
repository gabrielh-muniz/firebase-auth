import { Router } from "express";
import { verifyTokenId, verifyUserRole } from "../middlewares/auth.js";
import admin from "../config/firebase.js";
import { query } from "../db/connection.js";

export const router = Router();

router.post("/register", verifyTokenId, verifyUserRole, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  //TODO: verify if user already exists in the database

  try {
    const userRecord = await admin.auth().createUser({ email, password });

    await query(
      "INSERT INTO users (uid, email, display_name, roles) VALUES ($1, $2, $3, $4)",
      [userRecord.uid, email, userRecord.displayName, ["admin"]]
    );

    const actionCodeSettings = {
      url: `${process.env.FRONTEND_URL}/login`, // redirect URL after verification (could be login page)
    };

    const verificationLink = await admin
      .auth()
      .generateEmailVerificationLink(email, actionCodeSettings);

    // TODO: send this link via email to the user with Resend

    return res.status(201).json({
      message: "User registered successfully",
      verificationLink,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        emailVerified: userRecord.emailVerified,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Internal server error: ${error.message}` });
  }
});

router.get("/me", verifyTokenId, async (req, res) => {
  const { uid } = req.user;

  try {
    const result = await query("SELECT * FROM users WHERE uid = $1", [uid]);

    if (result.rows.length === 0)
      return res.status(404).json({ message: "User not found" });

    const roles = result.rows[0].roles;

    return res.status(200).json({ isAdmin: roles.includes("admin") });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Internal server error: ${error.message}` });
  }
});
