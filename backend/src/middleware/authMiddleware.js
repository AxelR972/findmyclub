import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1]; // Récupère le token après "Bearer " Authorization : [Bearer, <token>]

            const decoded = jwt.verify(token, process.env.JWT_SECRET); // Vérifie le token avec la clé secrète

            req.user = await User.findById(decoded.id).select("-password"); // Accès a toutes les propriétés de l'utilisateur sauf le mot de passe
            return next();
        } catch (err) {
            console.error("Token non valide", err);
            return res.status(401).json({ message: "Non autorisé, token non valide." });
        }
    }
    return res.status(401).json({ message: "Non autorisé, pas de token." });
}