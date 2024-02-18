import db from "../config/database.js";

// Middleware untuk memvalidasi token berdasarkan waktu kedaluwarsa
export const validateToken = async (req, res, next) => {
  // Ambil waktu kedaluwarsa token dari pengguna
  const token = req.headers["authorization"];
  // Periksa apakah waktu kedaluwarsa ada
  if (!token) {
    return res.status(401).json({ message: "Token tidak " });
  }

  try {
    const [cekToken] = await db.query("select * from token where token = ?", [
      token,
    ]);

    if (cekToken.length === 0) {
      return res.status(401).json({ message: "Token tidak ada" });
    }
    
    // Konversi expiredAt menjadi timestamp
    const expiredTime = Date.parse(cekToken.expiredAt); // Menggunakan Date.parse() jika dalam format yang sesuai

    // Periksa apakah waktu kedaluwarsa sudah terlewati
    const currentTime = Date.now();
    if (expiredTime < currentTime) {
      return res.status(401).json({ message: "Token has expired" });
    }
    const [user]= await db.query("select * from users where id = ?", [cekToken[0].user_id])
    req.user = user[0];

    // Token masih berlaku, lanjutkan ke middleware atau handler rute berikutnya
    next();
  } catch (error) {
    console.error("Error creating token:", error);
    return res.status(401).json({ message: "Invalid expired time format" });
  }
};

export const authorizePermission = (permission) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    try {
      // Query SQL untuk mendapatkan permissions berdasarkan role_id
      const query = `
        SELECT *
        FROM rolePermission
        WHERE rolePermission.role = ?
      `;
   
      const permissionQuery = `select * from permission where permission.name = ?`
    
      const [rolePermission] = await db.query(permissionQuery, [permission]);
    
      const [rows] = await db.query(query, [req.user.role]);
      
      // Mendapatkan nama permissions dari hasil query
     
        const cekPermission = rows.filter((row) => row.permission_id === rolePermission[0].id)
        console.log('eper', cekPermission)

        if (cekPermission.length === 0) {
          return res.status(403).json({
            message: "Forbidden",
          });
        }
     
      next();
    } catch (error) {
      console.error("Error authorizing permission:", error);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  };
};




