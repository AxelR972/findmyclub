import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Config dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
app.use(express.json());

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🟢 MongoDB connecté"))
  .catch((err) => console.error("🔴 Erreur MongoDB :", err));

// Tes routes
app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API FindMyClub !");
});

// Lancement serveur
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`🚀 Serveur lancé sur http://localhost:${port}`));
