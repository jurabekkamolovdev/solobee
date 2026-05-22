import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from '../model/request/create-student.dto';
import {
  ICreateStudent,
  INewStudent,
} from 'src/domain/student/service/student.service.interface';
import { Student } from 'src/domain/student/model/student.model';
import { StudentProfileDto } from '../model/response/student-profile-response.dto';
import {
  StudentObjectResponseDto,
  NewStudentObjectResponseDto,
  StudentResponseDto,
  NewStudentResponseDto,
} from '../model/response/student-response.dto';

@Injectable()
export class StudentWebMapper {
  toCreateParams(
    dto: CreateStudentDto,
    kindergartenId: string,
  ): ICreateStudent {
    return {
      kindergartenId,
      firstName: dto.firstName,
      lastName: dto.lastName,
      birthDate: dto.birthDate ?? null,
      address: dto.address ?? null,
      parentPhone: dto.parentPhone ?? null,
    };
  }

  toResponseDto(student: Student): StudentResponseDto {
    const dto = new StudentResponseDto();
    dto.userId = student.getUserId();
    dto.username = student.getUsername();
    dto.firstName = student.getFirstName();
    dto.lastName = student.getLastName();
    dto.score = student.getScore();
    dto.birthDate = student.getBirthDate()?.toISOString().split('T')[0] ?? null;
    dto.address = student.getAddress() ?? '';
    dto.createdAt = student.getCreatedAt();
    return dto;
  }

  toNewStudentResponseDto(student: INewStudent): NewStudentResponseDto {
    const dto = new NewStudentResponseDto();
    dto.id = student.id;
    dto.fullName = student.fullName;
    dto.username = student.username;
    dto.plainPassword = student.plainPassword;
    dto.kindergartenId = student.kindergartenId;
    return dto;
  }

  toObjectResponse(student: Student): StudentObjectResponseDto {
    const response = new StudentObjectResponseDto();
    response.data = this.toResponseDto(student);
    return response;
  }

  toNewStudentObjectResonse(
    newStudent: INewStudent,
  ): NewStudentObjectResponseDto {
    const response = new NewStudentObjectResponseDto();
    response.data = this.toNewStudentResponseDto(newStudent);
    return response;
  }

  toProfileDto(student: Student): StudentProfileDto {
    const dto = new StudentProfileDto();
    dto.firstName = student.getFirstName();
    dto.lastName = student.getLastName();
    dto.score = student.getScore();
    return dto;
  }
}

// Username: jurabek-c4e2
// Password: )M$E63PAth
