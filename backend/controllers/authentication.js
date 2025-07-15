import admin from "../config/firebase.js";
import { query } from "../db/connection.js";
import { catchError } from "../utils/errorHandler.js";

/**
 * Function to handle the user creating process
 * @param {Object} req - The request object containing user details
 * @param {Object} res - The response object to send back the result
 * @returns {Object} - Returns a JSON response with the user creation status
 */
export async function createUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  // Check if user already exists in the database
  const [errorCheck, existingUser] = await catchError(
    query("SELECT * FROM users WHERE email = $1", [email])
  );
  if (errorCheck) {
    console.error("Database query error:", errorCheck);
    return res.status(500).json({ message: "Internal server error" });
  }

  if (existingUser.rows.length > 0) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Create user in Firebase
  const [errorCreate, userRecord] = await catchError(
    admin.auth().createUser({ email, password })
  );
  if (errorCreate) {
    console.error("Firebase user creation error:", errorCreate);
    return res
      .status(500)
      .json({ message: `Internal server error: ${errorCreate.message}` });
  }

  // Insert user into the database
  const [errorInsert, _] = await catchError(
    query(
      "INSERT INTO users (uid, email, display_name, roles) VALUES ($1, $2, $3, $4)",
      [userRecord.uid, email, userRecord.displayName, ["admin"]]
    )
  );
  if (errorInsert) {
    console.error("Database insert error:", errorInsert);
    return res
      .status(500)
      .json({ message: `Internal server error: ${errorInsert.message}` });
  }

  // Generate a verification link to send to the user email
  const actionCodeSettings = {
    url: `${process.env.FRONTEND_URL}/login`, // redirect URL after verification (could be login page)
  };

  const [errorVerificationLink, verificationLink] = await catchError(
    admin.auth().generateEmailVerificationLink(email, actionCodeSettings)
  );
  if (errorVerificationLink) {
    console.error("Firebase verification link error:", errorVerificationLink);
  }

  //TODO: send this link via email to the user with Resend or any email service

  return res.status(201).json({
    message: "User registered successfully",
    verificationLink,
    user: {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName || null,
      emailVerified: userRecord.emailVerified,
    },
  });
}

/**
 * Function to fetch the current user's role status
 * @param {Object} req - The request object containing user details
 * @param {Object} res - The response object to send back the result
 * @returns {Object} - Returns a JSON response with the user's admin status
 */
export async function getCurrentUserRole(req, res) {
  const { uid } = req.user;

  if (!uid) return res.status(401).json({ message: "Unauthorized" });

  const [error, result] = await catchError(
    query("SELECT * FROM users WHERE uid = $1", [uid])
  );
  if (error) {
    console.error("Database query error:", error);
    return res
      .status(500)
      .json({ message: `Internal server error: ${error.message}` });
  }
  if (result.rows.length === 0)
    return res.status(404).json({ message: "User not found" });

  const roles = result.rows[0].roles;

  return res.status(200).json({ isAdmin: roles.includes("admin") });
}
