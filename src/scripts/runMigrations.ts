import pool from "../config/db.ts";
import path from "path";
import { readFileSync, readdirSync } from "fs";
const runMigration = async () => {
  try {
    const migrationsPath = path.join(import.meta.dirname, "../migrations");
    const files = readdirSync(migrationsPath).sort();
    for (const file of files) {
      if (file.endsWith(".sql")) {
        const filePath = path.join(migrationsPath, file);
        await pool.query(readFileSync(filePath, "utf-8"));
      }
    }
    await pool.end();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
runMigration();
