import crypto from 'crypto';
import db from "../config/database.js";

const createToken = async (userId) => {
  try {

      const token = crypto.randomBytes(64).toString("base64");
  //  const cekToken = await db.query("SELECT * FROM token WHERE token = ?", [token]);

  //   if (cekToken.length > 0) {
  //     return createToken(userId);
  //   }

    const query = `
      INSERT INTO token (token, user_id, expired_at)
      VALUES (?, ?, ?)
    `;

    const expiresAt = new Date(Date.now() + 2592000000); // 30 days
    const values = [token, userId, expiresAt];

    await db.query(query, values);
    return token;
  } catch (error) {
    console.error("Error creating token:", error);
    throw new Error("Error creating token");
  }
};

export default createToken;

