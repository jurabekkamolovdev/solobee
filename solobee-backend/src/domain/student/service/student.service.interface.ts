import { Student } from '../model/student.model';

export interface IStudentService {
  createStudent(params: ICreateStudent): Promise<INewStudent>;
  findAllStudents(kindergartenId: string): Promise<Student[]>;
  delete(kindergartenId: string, studentId: string): Promise<boolean>;
  getStudentProfile(studentId: string): Promise<Student>;
}

export const STUDENT_SERVICE = Symbol('STUDENT_SERVICE');

export interface ICreateStudent {
  kindergartenId: string;
  firstName: string;
  lastName: string;
  birthDate?: string | null;
  address?: string | null;
  parentPhone?: string | null;
}

export interface INewStudent {
  id: string;
  fullName: string;
  username: string;
  plainPassword: string | null;
  kindergartenId: string | null;
}
