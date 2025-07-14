import admin from "firebase-admin";
import { query } from "../db/connection.js";

export async function verifyTokenId(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

export async function verifyUserRole(req, res, next) {
  const { uid } = req.user;

  try {
    const result = await query("SELECT roles FROM users WHERE uid = $1", [uid]);
    if (result.rows.length === 0)
      return res.status(403).json({ message: "Forbidden: User not found" });

    const roles = result.rows[0].roles;

    if (!roles.includes("admin")) {
      return res
        .status(403)
        .json({ message: "Forbidden: Insufficient permissions" });
    }

    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Internal server error: ${error.message}` });
  }
}
