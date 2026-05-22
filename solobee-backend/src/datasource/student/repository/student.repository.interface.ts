import { Student } from 'src/domain/student/model/student.model';

export interface IStudentRepository {
  save(student: Student): Promise<Student>;
  findByKindergartenId(kindergartenId: string): Promise<Student[]>;
  findById(studentId: string): Promise<Student | null>;
}

export const STUDENT_REPOSITORY = Symbol('STUDENT_REPOSITORY');
