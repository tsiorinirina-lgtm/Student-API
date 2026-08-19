import { studentRepository } from "../repositories/studentRepository.ts";

export const studentStatsService = {
  get: async () => studentRepository.getStats(),
};
