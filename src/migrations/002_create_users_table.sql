CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(20),
    email VARCHAR(50),
    password_hash VARCHAR(255) NOT NULL,
    joined_at TIMESTAMP NOT NULL DEFAULT NOW()
)