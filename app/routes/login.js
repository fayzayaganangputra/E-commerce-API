import { Router } from "express";
import db from "../../config/database.js";
import createToken from "../token.js";
import bcrypt from "bcrypt";
import { validateToken } from "../middleware.js";
const router = Router();

router.post("/login", async (req, res) => {
  try {
    // Lakukan otentikasi pengguna (contoh: dengan username dan password)
    const { email, password } = req.body;
    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
     const user = users[0]
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    console.log(user);
    const cekPassword = bcrypt.compareSync(password, user.password);
    if (!cekPassword) {
      return res.status(401).json({ message: "Password Salah" });
    }
    const token = await createToken(user.id);
    
    req.user = user;

   return res.json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Rute untuk memvalidasi token
router.get("/validate",validateToken, (req, res) => {
  // Periksa apakah pengguna masuk dengan mengecek apakah sesi atau token ada
  if (req.user) {
    res.json({ message: "Token is valid", user:req.user });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

// Rute untuk menghapus token (logout)
router.delete("/logout", (req, res) => {
  // Hapus sesi atau token yang terkait dengan pengguna
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to logout" });
    } else {
      res.json({ message: "Logged out successfully" });
    }
  });
});

export default router;
