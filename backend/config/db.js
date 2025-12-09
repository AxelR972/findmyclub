// backend/config/db.js
import mongoose from "mongoose";

export async function connectDB(uri) {
  try {
    await mongoose.connect(uri);
    console.log("🟢 MongoDB connecté");
  } catch (err) {
    console.error("🔴 Erreur MongoDB :", err);
    process.exit(1); // quitte si impossible de se connecter
  }
}
