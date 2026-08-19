import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length).trim()
    : "";

  if (!token || !JWT_SECRET) {
    res.status(401).json({ error: "A valid Bearer token is required" });
    return;
  }

  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const createToken = (userId: number): string => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "1h" });
};