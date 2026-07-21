import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import {
  type IStudentService,
  ICreateStudent,
  IStudentProfile,
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
import {
  AVATAR_SERVICE,
  type IAvatarService,
} from 'src/domain/avatar/service/avatar.service.interface';
import {
  STORAGE_SERVICE,
  type IStorageService,
} from 'src/infrastructure/storage/storage.interface';

@Injectable()
export class StudentServiceImpl implements IStudentService {
  constructor(
    @Inject(USER_SERVICE)
    private readonly userService: IUserService,
    @Inject(STUDENT_REPOSITORY)
    private readonly studentRepository: IStudentRepository,
    @Inject(AVATAR_SERVICE)
    private readonly avatarService: IAvatarService,
    @Inject(STORAGE_SERVICE)
    private readonly storageService: IStorageService,
  ) {}

  async createStudent(params: ICreateStudent): Promise<boolean> {
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

  async findAll(
    offset: number,
    limit: number,
  ): Promise<{ items: Student[]; total: number }> {
    return this.studentRepository.findAll(offset, limit);
  }

  async getStudentProfile(studentId: string): Promise<IStudentProfile> {
    const student: Student | null =
      await this.studentRepository.findById(studentId);

    if (!student) throw new BadRequestException('Student profile not found');

    const studentAvatar = await this.avatarService.getById(
      student.getAvatarId(),
    );

    return {
      firstName: student.getFirstName(),
      lastName: student.getLastName(),
      username: student.getUsername(),
      age: student.getAge(),
      avatar: this.storageService.getPublicUrl(studentAvatar.getThumbnailKey()),
    };
  }
}
