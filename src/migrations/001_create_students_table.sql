CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    student_year NUMERIC(1),
    email VARCHAR(50),
    phone_number VARCHAR(15),
    birth_date DATE,
    joined_at DATE DEFAULT CURRENT
);

CREATE INDEX IF NOT EXISTS idx_student_email ON students(email);

CREATE INDEX IF NOT EXISTS idx_student_joined_at ON student(joined_at DESC);