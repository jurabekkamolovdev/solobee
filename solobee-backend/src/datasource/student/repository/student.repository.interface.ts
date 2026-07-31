import { Student } from 'src/domain/student/model/student.model';

export interface IStudentRepository {
  save(student: Student): Promise<boolean>;
  findByKindergartenId(kindergartenId: string): Promise<Student[]>;
  findAll(
    offset: number,
    limit: number,
  ): Promise<{ items: Student[]; total: number }>;
  findById(studentId: string): Promise<Student | null>;
  deleteById(studentId: string): Promise<boolean>;
}

export const STUDENT_REPOSITORY = Symbol('STUDENT_REPOSITORY');
