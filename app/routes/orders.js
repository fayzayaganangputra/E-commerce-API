import { Router } from "express";
import db from "../../config/database.js";
import { authorizePermission, validateToken } from "../middleware.js";
import { Permission } from "../autorization.js";
import axios from "axios";

const router = Router();

router.post("/orders",validateToken, authorizePermission(Permission.CREATE_ORDER), async (req, res) => {
    const { user_id, status } = req.body;
    try {
        const [cekCart] = await db.query(`select * from carts where user_id = ?`,[Number(user_id)])
        if (cekCart.length === 0) {
            return res.status(401).json({ message: "Cart Kosong" });
        }
        console.log(cekCart[0])
        const [cekProduct] = await db.query(`select ci.cart_id, ci.product_id,carts.user_id, ci.quantity, ci.price from cart_items ci join carts on ci.cart_id = carts.id where carts.user_id = ?`,[user_id])

        const total_amount = cekProduct.reduce((a, c) => a + c.price * c.quantity, 0)
        console.log(total_amount);
        console.log(cekProduct);
      const [results] = await db.execute(
        "INSERT INTO Orders (user_id, status, total_amount) VALUES (?,?,?)",
        [user_id, status, total_amount]
      );

    const [order] = await db.query(`select id from orders where user_id = ?`, [Number(user_id)])
    console.log(order[0].id);
    const promises = cekProduct.map(async (product) => {
      
      const [result] = await db.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price, subtotal) VALUES (?, ?, ?, ?, ?)",
        [order[0].id,product.product_id, product.quantity, product.price, (product.quantity * product.price)]
      );
      return result;
    });

    const hasil = Promise.all(promises)

    await db.execute(`delete from cart_items where cart_id = ?`, [cekCart[0].id])
    console.log(cekCart[0].id)
    await db.execute(`delete from carts where id =?`, [cekCart[0].id])

      return res.json({
        // id: results.insertId,
        message: "Order created successfully",
      });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).send("Internal Server Error");
    }
})

// router.delete("/order/orderId",validateToken, authorizePermission(Permission.CREATE_ORDER), async(req, res) => {
//     try {
//         const orderId = 
//     } catch (error) {
//       console.error("Error deleting order:", error);
//       res.status(500).json({ message: "Internal server error" });
//     } 
// }
// )

router.post(
  "/orders/pay",validateToken,
  authorizePermission(Permission.EDIT_ORDER),
  async (req, res) => {
    try {
      const data = req.body;
      const id = req.user.id;

      // res.json({req.user, data});

      if (!id || !data) {
        return res
          .status(400)
          .json({ message: "Missing order or payment data" });
      }

      if (
        !data.order_id ||
        !data.cardNumber ||
        !data.cvv ||
        !data.expiryMonth ||
        !data.expiryYear
      ) {
        return res.status(400).json({
          message: "Missing required fields in order or payment data",
        });
      }

      if (
        isNaN(data.order_id) ||
        isNaN(data.cardNumber) ||
        isNaN(data.cvv) ||
        isNaN(data.expiryMonth) ||
        isNaN(data.expiryYear)
      ) {
        return res.status(400).json({ message: "Invalid data" });
      }

      const [order] = await db.query(
        "SELECT * FROM orders WHERE user_id = ? AND id = ? LIMIT 1",
        [id, data.order_id]
      );
      if (!order) {
        return res.status(401).json({ message: "Order not found" });
      }
      if (order.status === "paid") {
        return res.status(400).json({ message: "Order already paid" });
      }

      const dataPayment = {
        amount: order[0].total_amount,
        cardNumber: data.cardNumber,
        cvv: data.cvv,
        expiryMonth: data.expiryMonth,
        expiryYear: data.expiryYear,
      };
      console.log(dataPayment);

      const validNumber = /^\d{16}$/.test(dataPayment.cardNumber);
      if (!validNumber) {
        return res.status(400).json({ message: "Invalid card number" });
      }

      const paymentResponse = await axios.post(
        "http://localhost:3000/pay",
        dataPayment
      );

      if (paymentResponse.status === 200) {
        await db.query("UPDATE orders SET status = ? WHERE id = ?", ["completed",order[0].id,]);
      } else {
  await db.query(
    "UPDATE orders SET status = ? WHERE id = ?",
    ["failed", order.id]
  );
}
      res.json({ message: "success", payment: paymentResponse.data });
    } catch (error) {
      console.error("Error processing payment:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);
export default router;