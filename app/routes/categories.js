import { Router } from "express";
import db from "../../config/database.js";

const router = Router();

router.get("/categories", async (req, res) => {
  try {
   
    const [results] = await db.query("SELECT * FROM Categories");
    res.json(results);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).send("Internal Server Error");
  }
});


router.get("/categories/:id", async (req, res) => {
  const { id } = req.params;
  try {
   
    const [results] = await db.query(
      "SELECT * FROM categories WHERE id = ?",
      [id]
    );
   
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send("Category not found");
    }
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).send("Internal Server Error");
  }
});


router.post("/categories", async (req, res) => {
  const { name, description } = req.body;
  try {
    const [results] = await db.query(
      "INSERT INTO Categories (name, description) VALUES (?, ?)",
      [name, description]
    );
    
    res.json({ id: results.insertId, message: "Category created successfully" });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).send("Internal Server Error");
  }
});


router.delete("/categories/:id", async (req, res) => {
  const { id } = req.params;
  try {
    
    const [results] = await db.execute(
      "DELETE FROM Categories WHERE id = ?",
      [id]
    );
   
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
