import express from "express";
import products from "./app/routes/product.js";
import categories from "./app/routes/categories.js";
import users from "./app/routes/users.js";
import token from "./app/routes/login.js";
import cart from "./app/routes/carts.js";
import {validateToken} from "./app/middleware.js"
import orders from "./app/routes/orders.js"

const app = express();
app.use(express.json());
app.use(token);
app.use(validateToken);
app.use(products);
app.use(categories);
app.use(users);
app.use(cart);
app.use(orders)


export default app;
