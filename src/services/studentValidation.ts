import type { StudentDTO } from "../models/student.ts";

export type ValidationResult =
  | { valid: true; data: StudentDTO }
  | { valid: false; errors: string[] };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateStudent = (input: unknown): ValidationResult => {
  if (!input || typeof input !== "object") {
    return { valid: false, errors: ["Request body must be an object"] };
  }

  const body = input as Record<string, unknown>;
  const errors: string[] = [];
  const requiredStrings = ["first_name", "last_name", "email", "phone_number"];

  for (const field of requiredStrings) {
    if (typeof body[field] !== "string" || body[field].trim() === "") {
      errors.push(`${field} is required`);
    }
  }

  const firstName =
    typeof body.first_name === "string" ? body.first_name.trim() : "";
  const lastName =
    typeof body.last_name === "string" ? body.last_name.trim() : "";
  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const phoneNumber =
    typeof body.phone_number === "string" ? body.phone_number.trim() : "";

  if (firstName.length > 50)
    errors.push("first_name must be 50 characters or fewer");
  if (lastName.length > 50)
    errors.push("last_name must be 50 characters or fewer");
  if (email && (!emailPattern.test(email) || email.length > 50))
    errors.push(
      "email must be a valid email address of 50 characters or fewer",
    );
  if (phoneNumber.length > 15)
    errors.push("phone_number must be 15 characters or fewer");

  const studentYear = body.student_year;
  if (
    typeof studentYear !== "number" ||
    !Number.isInteger(studentYear) ||
    studentYear < 1 ||
    studentYear > 9
  ) {
    errors.push("student_year must be an integer between 1 and 9");
  }

  const birthDate =
    typeof body.birth_date === "string" || body.birth_date instanceof Date
      ? new Date(body.birth_date)
      : new Date("invalid");
  if (Number.isNaN(birthDate.getTime()))
    errors.push("birth_date must be a valid date");

  if (errors.length > 0) return { valid: false, errors };
  return {
    valid: true,
    data: {
      first_name: firstName,
      last_name: lastName,
      email,
      phone_number: phoneNumber,
      student_year: studentYear as number,
      birth_date: birthDate,
    },
  };
};
