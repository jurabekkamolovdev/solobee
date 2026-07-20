import {
  Injectable,
  Inject,
  // NotFoundException,
  // ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import {
  type IStudentService,
  ICreateStudent,
} from './student.service.interface';
import { Student } from '../model/student.model';
import {
  USER_SERVICE,
  type IUserService,
} from 'src/domain/user/service/user.service.interface';
import {
  STUDENT_REPOSITORY,
  type IStudentRepository,
} from 'src/datasource/student/repository/student.repository.interface';
import { Role } from 'src/core/utils/role.enum';
import { User } from 'src/domain/user/model/user.model';
import { AVATAR_SERVICE } from 'src/domain/avatar/service/avatar.service.interface';
import { type IAvatarService } from 'src/domain/avatar/service/avatar.service.interface';

@Injectable()
export class StudentServiceImpl implements IStudentService {
  constructor(
    @Inject(USER_SERVICE)
    private readonly userService: IUserService,
    @Inject(STUDENT_REPOSITORY)
    private readonly studentRepository: IStudentRepository,
    @Inject(AVATAR_SERVICE)
    private readonly avatarService: IAvatarService,
  ) {}

  async createStudent(params: ICreateStudent): Promise<boolean> {
    // if (!params.kindergartenId) {
    //   throw new BadRequestException('Kindergarten context is required');
    // }

    const user: User = await this.userService.create({
      username: params.userName,
      role: Role.STUDENT,
      password: params.password,
      kindergartenId: params.kindergartenId,
    });

    await this.avatarService.getById(params.avatarId);

    const student: Student = Student.create(
      user.getId(),
      user.getUsername(),
      params.firstName,
      params.lastName,
      params.age,
      params.avatarId,
      params.birthDate,
      params.address,
      params.parentPhone,
    );

    return this.studentRepository.save(student);
  }

  // async findAllStudents(kindergartenId: string): Promise<Student[]> {
  //   return this.studentRepository.findByKindergartenId(kindergartenId);
  // }

  // async delete(kindergartenId: string, studentId: string): Promise<boolean> {
  //   const user: User | null = await this.userService.findById(studentId);

  //   if (!user) {
  //     throw new NotFoundException(`Student with id "${studentId}" not found`);
  //   }

  //   if (user.getRole() !== Role.STUDENT) {
  //     throw new ForbiddenException(`User "${studentId}" is not a student`);
  //   }

  //   if (user.getKindergartenId() !== kindergartenId) {
  //     throw new ForbiddenException(
  //       `Student does not belong to your kindergarten`,
  //     );
  //   }

  //   return this.userService.delete(studentId);
  // }
  async findAll(
    offset: number,
    limit: number,
  ): Promise<{ items: Student[]; total: number }> {
    return this.studentRepository.findAll(offset, limit);
  }

  async getStudentProfile(studentId: string): Promise<Student> {
    const student: Student | null =
      await this.studentRepository.findById(studentId);

    if (!student) throw new BadRequestException('Student profile not found');

    return student;
  }
}
