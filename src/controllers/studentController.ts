import type { Request, Response } from "express";
import type { StudentDTO } from "../models/student.ts";
import { studentRepository } from "../repositories/studentRepository.ts";
import { validateStudent } from "../services/studentValidation.ts";
import { studentStatsService } from "../services/studentStats.ts";
export const studentController = {
  getStats: async (req: Request, res: Response): Promise<void> => {
    try {
      res.json({ data: await studentStatsService.get() });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  },
  getAll: async (req: Request, res: Response): Promise<void> => {
    try {
      const students = await studentRepository.findAll();
      res.json({ count: students.length, data: students });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  },
  getById: async (req: Request, res: Response): Promise<void> => {
    try {
      const student = await studentRepository.findById(Number(req.params.id));
      if (!student) {
        res.status(404).json({
          status: 404,
          details: "Student not found check your inputs",
        });
        return;
      }
      res.json({ data: student });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  },
  create: async (
    req: Request<{}, {}, StudentDTO>,
    res: Response,
  ): Promise<void> => {
    try {
      const validation = validateStudent(req.body);
      if (!validation.valid) {
        res.status(400).json({ errors: validation.errors });
        return;
      }
      const student = await studentRepository.create(validation.data);
      res.status(201).json({ data: student });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  },
  update: async (
    req: Request<{ id: string }, {}, StudentDTO>,
    res: Response,
  ): Promise<void> => {
    try {
      const studentId = Number(req.params.id);
      if (!Number.isInteger(studentId) || studentId < 1) {
        res
          .status(400)
          .json({ error: "Student id must be a positive integer" });
        return;
      }

      let payload: unknown = req.body;
      if (req.method === "PATCH") {
        const currentStudent = await studentRepository.findById(studentId);
        if (!currentStudent) {
          res.status(404).json({
            status: 404,
            details: "Student not found check your inputs",
          });
          return;
        }
        payload = { ...currentStudent, ...req.body };
      }

      const validation = validateStudent(payload);
      if (!validation.valid) {
        res.status(400).json({ errors: validation.errors });
        return;
      }
      const student = await studentRepository.update(
        studentId,
        validation.data,
      );
      if (!student) {
        res.status(404).json({
          status: 404,
          details: "Student not found check your inputs",
        });
        return;
      }
      res.status(200).json({ data: student });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  },
  remove: async (req: Request, res: Response): Promise<void> => {
    try {
      const student = await studentRepository.delete(Number(req.params.id));
      if (!student) {
        res.status(404).json({
          status: 404,
          details: "Student not found check your inputs",
        });
        return;
      }
      res.sendStatus(204);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  },
};
