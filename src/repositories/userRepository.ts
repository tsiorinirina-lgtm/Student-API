import pool from "../config/db.ts";
import type { User, UserDTO } from "../models/user.ts";

export const userRepository = {
  findAll: async (): Promise<User[]> => {
    const result = await pool.query<User>("SELECT * FROM users ORDER BY id");
    return result.rows;
  },
  findById: async (id: Number): Promise<User> => {
    const result = await pool.query<User>("SELECT * FROM users WHERE id=$1", [
      id,
    ]);
    return result.rows[0];
  },
  findByEmail: async (email: string): Promise<User | null> => {
    const result = await pool.query<User>(
      "SELECT * FROM users WHERE email=$1",
      [email],
    );
    return result.rows[0] || null;
  },
  create: async (input: UserDTO): Promise<User> => {
    const { username, email, password_hash } = input;
    const result = await pool.query(
      "INSERT INTO users(username, email,password_hash) VALUES ($1,$2,$3) RETURNING *",
      [username, email, password_hash],
    );
    return result.rows[0];
  },
};
