export interface Student {
  std: number;
  first_name: string;
  last_name: string;
  student_year: number;
  email: string;
  phone_number: string;
  birth_date: Date;
  joined_at: Date;
}

export interface CreateStudentDTO {
  first_name: string;
  last_name: string;
  student_year: number;
  email: string;
  phone_number: string;
  birth_date: Date;
}

export interface UpdateStudentDTO {
  first_name: string;
  last_name: string;
  student_year: number;
  email: string;
  phone_number: string;
  birth_date: Date;
}
