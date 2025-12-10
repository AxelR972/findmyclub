import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
}, { timestamps: true }); // Ajoute createdAt et updatedAt automatiquement

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return; // Si le mot de passe n'est pas modifié, ne rien faire
  const salt = await bcrypt.genSalt(10); // Génère un salt pour le hash
  this.password = await bcrypt.hash(this.password, salt); // Hash le mot de passe
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); // Compare le mot de passe entré avec le mot de passe hashé dans la DB
}

const User = mongoose.model("User", userSchema);

export default User;