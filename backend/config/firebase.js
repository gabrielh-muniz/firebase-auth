import { config } from "dotenv";
import admin from "firebase-admin";

config();

const buffer = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, "base64");
const serviceAccount = JSON.parse(buffer.toString("utf8"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
