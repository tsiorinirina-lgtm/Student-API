import pool from "../config/db.ts";
import type {
  Student,
  CreateStudentDTO,
  UpdateStudentDTO,
} from "../models/student.ts";

export const studentRepository = {
  findAll: async (): Promise<Student[]> => {
    const result = await pool.query<Student>(
      "SELECT * FROM students ORDER BY id",
    );
    return result.rows;
  },
  findById: async (id: number): Promise<Student | null> => {
    const result = await pool.query<Student>(
      "SELECT * FROM students WHERE id = $1",
      [id],
    );
    return result.rows[0] || null;
  },
  create: async (input: CreateStudentDTO): Promise<Student> => {
    const {
      first_name,
      last_name,
      student_year,
      email,
      phone_number,
      birth_date,
    } = input;
    const result = await pool.query<Student>(
      "INSERT INTO students (first_name, last_name, student_year, email, phone_number, birth_date ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [first_name, last_name, student_year, email, phone_number, birth_date],
    );
    return result.rows[0];
  },
  update: async (input: UpdateStudentDTO): Promise<Student> => {
    const {
      first_name,
      last_name,
      student_year,
      email,
      phone_number,
      birth_date,
    } = input;
    const result = await pool.query<Student>(
      "UPDATE students (first_name, last_name, student_year, email, phone_number, birth_date ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *:",
      [first_name, last_name, student_year, email, phone_number, birth_date],
    );
    return result.rows[0];
  },
  delete: async (id: number): Promise<Student | null> => {
    const result = await pool.query<Student>(
      "DELETE students WHERE id = $1 RETURNING *",
      [id],
    );
    return result.rows[0] || null;
  },
};
