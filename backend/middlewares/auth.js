import admin from "firebase-admin";
import { query } from "../db/connection.js";
import { catchError } from "../utils/errorHandler.js";

export async function verifyTokenId(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const [error, decodedToken] = await catchError(
    admin.auth().verifyIdToken(token)
  );
  if (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
  req.user = decodedToken;
  next();
  // try {
  //   const decodedToken = await admin.auth().verifyIdToken(token);
  //   req.user = decodedToken;
  //   next();
  // } catch (error) {
  //   return res.status(401).json({ message: "Unauthorized" });
  // }
}

export async function verifyUserRole(req, res, next) {
  const { uid } = req.user;

  if (!uid) return res.status(401).json({ message: "Unauthorized" });
  //console.log(uid);
  const [error, result] = await catchError(
    query("SELECT roles FROM users WHERE uid = $1", [uid])
  );
  if (error) {
    console.error("Database query error:", error);
    return res
      .status(500)
      .json({ message: `Internal server error: ${error.message}` });
  }

  if (result.rows.length === 0)
    return res.status(403).json({ message: "Forbidden: User not found" });

  const roles = result.rows[0].roles;

  if (!roles.includes("admin"))
    return res
      .status(403)
      .json({ message: "Forbidden: Insufficient permissions" });

  next();
  // try {
  //   const result = await query("SELECT roles FROM users WHERE uid = $1", [uid]);
  //   if (result.rows.length === 0)
  //     return res.status(403).json({ message: "Forbidden: User not found" });

  //   const roles = result.rows[0].roles;

  //   if (!roles.includes("admin")) {
  //     return res
  //       .status(403)
  //       .json({ message: "Forbidden: Insufficient permissions" });
  //   }

  //   next();
  // } catch (error) {
  //   return res
  //     .status(500)
  //     .json({ message: `Internal server error: ${error.message}` });
  // }
}
