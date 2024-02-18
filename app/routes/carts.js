import { Router } from "express";
import db from "../../config/database.js";
import { authorizePermission, validateToken } from "../middleware.js";
import { Permission } from "../autorization.js";

const router = Router();
router.get("/cart/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
   
    const [results] = await db.query(
      "SELECT * FROM Carts WHERE user_id = ?",
      [user_id]
    );
   
    res.json(results);
  } catch (error) {
    console.error("Error fetching user cart:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Route untuk menambahkan item ke keranjang belanja pengguna
router.post(
  "/cart/add",
  validateToken,
  authorizePermission(Permission.ADD_TO_CART),
  async (req, res) => {
    const { product_id, quantity } = req.body;
    try {
      console.log(req.user);

      const [cekCart] = await db.query(
        `select * from carts where carts.user_id = ?`,
        [req.user.id]
      );

      if (cekCart.length > 0) {
        const [cekID] = await db.query(
          `select * from cart_items where cart_items.cart_id = ? AND cart_items.product_id = ?`,
          [cekCart[0].id, product_id]
        );


        if (cekID.length < 1) {
          
          const [cekPrice] = await db.query( `select * from products where products.id = ?`,[req.body.product_id]);
          console.log(cekPrice[0]);
          const price = cekPrice[0].price;
          const [results] = await db.execute(
            "INSERT INTO Cart_Items (cart_id, product_id, quantity, price) VALUES (?,?,?,?)",
            [cekCart[0].id, product_id, quantity, price]
          );
          return res.json({ message: "Berhasil" });
        } else {
          console.log(cekID);
          const [results] = await db.execute(
            "UPDATE cart_items SET cart_items.quantity = ? WHERE cart_items.cart_id = ? AND cart_items.product_id = ?",
            [quantity + cekID[0].quantity, cekID[0].cart_id, product_id]
          );
          return res.json({
            //   id: results.insertId,
            message: "Item update to cart successfully",
          });
        }
      } else {
        const [results] = await db.execute(
          "INSERT INTO Carts (user_id) VALUES (?)",
          [req.user.id]
        );

        return res.json({
          //   id: results.insertId,
          message: "Item added to cart successfully",
        });
      }
      
    } catch (error) {
      console.error("Error adding item to cart:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Route untuk menghapus item dari keranjang belanja pengguna
router.delete("/cart/:cart_id/item/:item_id", async (req, res) => {
  const { cart_id, item_id } = req.params;
  try {
   
    const [results] = await db.execute(
      "DELETE FROM Cart_Items WHERE cart_id = ? AND id = ?",
      [cart_id, item_id]
    );
    
    res.json({ message: "Item deleted from cart successfully" });
  } catch (error) {
    console.error("Error deleting item from cart:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;