import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { userRepository } from "../repositories/userRepository.ts";
import type { CredentialsDTO, RegisterDTO } from "../models/user.ts";
import { createToken } from "../security/auth.ts";

export const userController = {
  getAll: async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await userRepository.findAll();
      res.status(200).json({ count: users.length, data: users });
    } catch (error) {
      console.log(error);
      res.status(500);
    }
  },
  getById: async (req: Request, res: Response): Promise<void> => {
    try {
      const user = userRepository.findById(Number(req.params.id));
      res.status(200).json({ user });
    } catch (error) {
      console.log(error);
      res.status(500);
    }
  },
  register: async (
    req: Request<{}, {}, RegisterDTO>,
    res: Response,
  ): Promise<void> => {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        res
          .status(400)
          .json({ error: "username, email and password are required" });
        return;
      }
      if (await userRepository.findByEmail(email)) {
        res.status(409).json({ error: "Email is already registered" });
        return;
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await userRepository.create({
        username,
        email,
        password_hash: passwordHash,
      });
      res.status(201).json({
        data: { id: user.id, username: user.username, email: user.email },
        token: createToken(user.id),
      });
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  },
  login: async (
    req: Request<{}, {}, CredentialsDTO>,
    res: Response,
  ): Promise<void> => {
    try {
      const { email, password } = req.body;
      const user =
        email && password ? await userRepository.findByEmail(email) : null;
      if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }
      res.status(200).json({
        data: { id: user.id, username: user.username, email: user.email },
        token: createToken(user.id),
      });
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  },
};
