import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
try {
  pool
    .query("SELECT NOW()")
    .then((res) =>
      console.log("PostgreSQL connected succesfully", res.rows[0].now),
    );
  pool
    .query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema NOT IN ('pg_catalog', 'information_schema')AND table_type ='BASE TABLE';",
    )
    .then((res) =>
      res.rows.forEach((row) =>
        console.log("Tables in the database:", row.table_name),
      ),
    );
} catch (error) {
  console.log("An error occurred:", error);
}
export default pool;
