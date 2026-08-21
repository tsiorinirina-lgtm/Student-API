import pool from "../config/db.ts";
import type { Student, StudentDTO } from "../models/student.ts";

export const studentRepository = {
  getStats: async (): Promise<{
    total: number;
    average_year: number | null;
    by_year: Array<{ student_year: number; count: number }>;
  }> => {
    const result = await pool.query<{
      total: string;
      average_year: string | null;
      by_year: Array<{ student_year: number; count: number }>;
    }>(
      `WITH totals AS (
         SELECT COUNT(*)::int AS total, ROUND(AVG(student_year), 2) AS average_year
         FROM students
       ), year_stats AS (
         SELECT student_year, COUNT(*)::int AS count
         FROM students
         GROUP BY student_year
       )
       SELECT totals.total, totals.average_year,
         COALESCE(
           json_agg(year_stats ORDER BY year_stats.student_year)
             FILTER (WHERE year_stats.student_year IS NOT NULL),
           '[]'
         ) AS by_year
       FROM totals
       LEFT JOIN year_stats ON TRUE
       GROUP BY totals.total, totals.average_year`,
    );
    const stats = result.rows[0];
    return {
      total: Number(stats.total),
      average_year:
        stats.average_year === null ? null : Number(stats.average_year),
      by_year: stats.by_year,
    };
  },
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
  create: async (input: StudentDTO): Promise<Student> => {
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
  updatePartial: async (
    id: number,
    input: Partial<StudentDTO>,
  ): Promise<Student | null> => {
    const fields = Object.keys(input) as Array<keyof StudentDTO>;
    const values = fields.map((field) => input[field]);
    const assignments = fields.map((field, index) => `${field}=$${index + 1}`);
    const result = await pool.query<Student>(
      `UPDATE students SET ${assignments.join(", ")} WHERE id = $${values.length + 1} RETURNING *`,
      [...values, id],
    );
    return result.rows[0] || null;
  },
  update: async (id: number, input: StudentDTO): Promise<Student | null> => {
    const {
      first_name,
      last_name,
      student_year,
      email,
      phone_number,
      birth_date,
    } = input;
    const result = await pool.query<Student>(
      "UPDATE students SET first_name=$1, last_name=$2, student_year=$3, email=$4, phone_number=$5, birth_date=$6 WHERE id=$7 RETURNING *",
      [
        first_name,
        last_name,
        student_year,
        email,
        phone_number,
        birth_date,
        id,
      ],
    );
    return result.rows[0] || null;
  },
  delete: async (id: number): Promise<Student | null> => {
    const result = await pool.query<Student>(
      "DELETE FROM students WHERE id = $1 RETURNING *",
      [id],
    );
    return result.rows[0] || null;
  },
};
