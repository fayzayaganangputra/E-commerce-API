import { Router } from "express";
import db from "../../config/database.js";
import { authorizePermission, validateToken } from "../middleware.js";
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

router.delete("/products/:id", async (req, res) => {
  try {
    const productId = Number(req.params.id);

    // Periksa apakah produk dengan ID yang diberikan ada dalam database
    const [product] = await db.query("SELECT * FROM products WHERE id = ?", [productId]);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Hapus produk dari database
    await db.query("DELETE FROM products WHERE id = ?", [Number(productId)]);

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/products/search", async (req, res) => {
  try {
    const { name, category } = req.query;

    //kondisi query berdasarkan parameter yang diberikan
    let query = `SELECT * FROM products WHERE 1=1`;
    if (name) {
      query += ` AND name LIKE '%${name}%'`;
    }
    if (category) {
      query += ` AND category_id = ${Number(category)}`;
    }

    // Eksekusi query ke database
    const [results] = await db.query(query);

    // Kirim hasil pencarian ke klien
    res.json(results);
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;