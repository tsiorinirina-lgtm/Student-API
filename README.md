# Student API

This is a practice project for using express to make an API.

## Render deployment

Use these Render settings:

- Build Command: `npm run build`
- Start Command: `npm start`

Configure these environment variables in the Render web service:

- `DATABASE_URL`: choose the internal database URL from the linked Render PostgreSQL database.
- `JWT_SECRET`: generate a long random secret and keep it private.
- `PORT`: leave unset; Render provides it automatically.

Run migrations once after deployment with `npm run migrate` using the same `DATABASE_URL`.
