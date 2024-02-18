import db from "../config/database.js";
import { Permission, Role, RolePermission } from "./autorization.js";

const main = async () => {
  try {
    await db.query("delete from permission")

    for (const permission in Permission) {
      await db.query("INSERT INTO permission (name) VALUES (?)", [
        Permission[permission],
      ]);
    }

    
    for (const role in RolePermission) {
      for (const permission of RolePermission[role]) {
        const [permissionRecord] = await db.query(
          "SELECT id FROM permission WHERE name = ?",
          [permission]
        );
            console.log(role)
            console.log(permissionRecord)
        await db.query(
          "INSERT INTO rolePermission (role, permission_id) VALUES (?, ?)",
          [role, permissionRecord[0].id]
        );
      }
    }

    console.log("Seeder telah dijalankan dengan sukses.");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    db.end();
  }
};

main();
