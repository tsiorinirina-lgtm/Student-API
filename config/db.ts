import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool
  .query("SELECT NOW()")
  .then((res) =>
    console.log("PostgreSQL connected succesfully", res.rows[0].now),
  );
export default pool;
