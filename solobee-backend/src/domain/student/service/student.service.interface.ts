import { Student } from '../model/student.model';

export interface IStudentService {
  createStudent(params: ICreateStudent): Promise<boolean>;
  // findAllStudents(kindergartenId: string): Promise<Student[]>;
  findAll(
    offset: number,
    limit: number,
  ): Promise<{ items: Student[]; total: number }>;
}

export const STUDENT_SERVICE = Symbol('STUDENT_SERVICE');

export interface ICreateStudent {
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  age: number;
  avatarId: string;
  birthDate?: string | null;
  kindergartenId?: string | null;
  address?: string | null;
  parentPhone?: string | null;
}

// export interface INewStudent {
//   id: string;
//   fullName: string;
//   username: string;
//   kindergartenId: string | null;
// }
