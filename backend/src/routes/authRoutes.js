import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";
import jwt from "jsonwebtoken";

const router = express.Router();


//Register
router.post('/register', async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  try {
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Les mots de passe ne sont pas identiques." });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "L'utilisateur existe déjà." });
    }

    const user = await User.create({ username, email, password });

    const token = generateToken(user._id);

    res.status(201).json({
      id: user._id,
      username: user.username,
      email: user.email,
      token,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Erreur du serveur." });
  }
});


//Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Tous les champs sont requis." });
        }
        const user = await User.findOne({ email }); // Trouve l'utilisateur par email si il est enregistré

        if (!user || !(await user.matchPassword(password))) { // Vérifie si le mot de passe correspond à celui dans la DB
            return res.status(401).json({ message: "Email ou mot de passe invalide." }); // 401 signifie non autorisé
        }

        const token = generateToken(user._id); // Génère un token JWT pour l'utilisateur
        res.status(200).json({  // 200 signifie succès
            id: user._id,
            username: user.username,
            email: user.email,
            token,
        });

    } catch (err) {
        res.status(500).json({ message: "Erreur du serveur." });
    }
})

// Récupérer les infos de l'utilisateur connecté
router.get("/me", protect, async (req, res) => {
    res.status(200).json(req.user);
});

//Génère un nouveau JWT token

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" }); // Crée un token avec l'ID utilisateur et la clé secrète, valable 30 jours
}


export default router;
