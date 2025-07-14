import { Router } from "express";
import { verifyTokenId, verifyUserRole } from "../middlewares/auth.js";
import admin from "../config/firebase.js";
import { query } from "../db/connection.js";

export const router = Router();

router.post(
  "/register",
  /*verifyTokenId, verifyUserRole,*/ async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    //TODO: verify if user already exists in the database

    try {
      const userRecord = await admin.auth().createUser({ email, password });

      await query(
        "INSERT INTO users (uid, email, display_name, roles) VALUES ($1, $2, $3, $4)",
        [userRecord.uid, email, userRecord.displayName, ["admin"]]
      );

      //TODO: send verification email
      const actionCodeSettings = {
        url: `${process.env.FRONTEND_URL}/verify-email`,
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
  }
);
