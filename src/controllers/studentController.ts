import type { Request, Response } from "express";
import type { CreateStudentDTO, UpdateStudentDTO } from "../models/student.ts";
import { studentRepository } from "../repositories/studentRepository.ts";
import { log } from "node:console";
export const studentController = {
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
    req: Request<{}, {}, CreateStudentDTO>,
    res: Response,
  ): Promise<void> => {
    try {
      const {
        first_name,
        last_name,
        student_year,
        email,
        phone_number,
        birth_date,
      } = req.body;
      const student = await studentRepository.create({
        first_name,
        last_name,
        email,
        student_year,
        phone_number,
        birth_date,
      });
      res.status(201).json({ data: student });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  },
  update: async (
    req: Request<{}, {}, UpdateStudentDTO>,
    res: Response,
  ): Promise<void> => {
    try {
      const {
        first_name,
        last_name,
        student_year,
        email,
        phone_number,
        birth_date,
      } = req.body;
      const student = await studentRepository.update({
        first_name,
        last_name,
        email,
        student_year,
        phone_number,
        birth_date,
      });
      res.status(200).json({ data: student });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  },
  remove: async (req: Request, res: Response): Promise<void> => {
    try {
      const student = await studentRepository.findById(Number(req.params.id));
      if (!student) {
        res.status(404).json({
          status: 404,
          details: "Student not found check your inputs",
        });
        return;
      }
      res.status(204);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  },
};
