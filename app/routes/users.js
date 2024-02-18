import { Router } from "express";
import db from "../../config/database.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();
const router = Router();

router.get("/users", async (req, res) => {
  try {
    const [results] = await db.query(
      "SELECT id, username, email,address,phone_number, role FROM Users"
    );
    res.json(results);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Internal Server Error");
  }
});


router.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await db.query(
      "SELECT id, username, email, role FROM Users WHERE id = ?",
      [id]
    );
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).send("Internal Server Error");
  }
});


router.post("/users", async (req, res) => {
  const { username, email, password,address,phone_number, role } = req.body;

  try {
    const [results] = await db.execute(
      "INSERT INTO Users (username, email, password,address,phone_number, role) VALUES (?, ?, ?, ?,?,?)",
      [username, email, bcrypt.hashSync(password,Number(process.env.BCRYPT_ROUND)),address,phone_number, role]
    );

    res.json({ id: results.insertId, message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Internal Server Error");
  }
});


router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await db.query(
      "DELETE FROM Users WHERE id = ?",
      [id]
    );
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;