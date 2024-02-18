import { Router } from "express";
import db from "../../config/database.js";
import { authorizePermission } from "../middleware.js";
import { Permission } from "../autorization.js";
const router = Router();

router.get("/products", async (req, res) => {
  try {
   
    const [results] = await db.query("SELECT * FROM products");
    res.json(results);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/products", authorizePermission(Permission.ADD_PRODUCT), async (req, res) => {
  const { name, description, price, stock_quantity, category_id } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO products (name, description, price, stock_quantity, category_id) VALUES (?, ?, ?, ?, ?)",
      [name, description, price, stock_quantity, category_id]
    );
   
    res.json({ id: result.insertId, message: "Product created successfully" });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;