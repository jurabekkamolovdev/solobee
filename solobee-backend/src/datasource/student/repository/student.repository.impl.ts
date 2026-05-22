import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { type IStudentRepository } from './student.repository.interface';
import { Student } from 'src/domain/student/model/student.model';
import { StudentEntity } from '../model/student.entity';
import { StudentDataMapper } from '../mapper/student-data.mapper';
import { Role } from 'src/core/utils/role.enum';

@Injectable()
export class StudentRepositoryImpl implements IStudentRepository {
  constructor(
    @InjectRepository(StudentEntity)
    private readonly students: Repository<StudentEntity>,
    private readonly mapper: StudentDataMapper,
  ) {}

  async save(student: Student): Promise<Student> {
    const entity: StudentEntity = this.mapper.toEntity(student);
    const saved = await this.students.save(entity);
    return this.mapper.toDomain(saved);
  }

  async findByKindergartenId(kindergartenId: string): Promise<Student[]> {
    const entities = await this.students
      .createQueryBuilder('student')
      .innerJoin('student.user', 'user')
      .where('user.kindergartenId = :kindergartenId', { kindergartenId })
      .andWhere('user.role = :role', { role: Role.STUDENT })
      .getMany();

    return entities.map((e) => this.mapper.toDomain(e));
  }

  async findById(studentId: string): Promise<Student | null> {
    const entity: StudentEntity | null = await this.students.findOne({
      where: { userId: studentId },
    });

    if (!entity) return null;

    return this.mapper.toDomain(entity);
  }
}
