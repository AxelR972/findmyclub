import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import clubRoutes from "./routes/clubs.js";
import { connectDB } from "./config/db.js";
import cors from "cors";

// Config dotenv
dotenv.config();


const PORT = process.env.PORT || 5000;

// Initialisation express

const app = express();

app.use(cors({
  origin: "http://localhost:5173", // front Vite
  credentials: true
}));

app.use(express.json()); //Dit à express de parser le JSON des requêtes entrantes

connectDB();
// Routes
app.use("/api/users", authRoutes); // Toutes les routes d'authentification seront préfixées par /api/users
app.use("/api/clubs", clubRoutes);



// Lancement serveur

app.listen(PORT, () => console.log(`Serveur lancé sur http://localhost:${PORT}`));