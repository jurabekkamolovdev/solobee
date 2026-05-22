import { Injectable } from '@nestjs/common';
import { Student } from 'src/domain/student/model/student.model';
import { StudentEntity } from '../model/student.entity';

@Injectable()
export class StudentDataMapper {
  toDomain(entity: StudentEntity): Student {
    return new Student({
      id: entity.id,
      userId: entity.userId,
      username: entity.username,
      firstName: entity.firstName,
      lastName: entity.lastName,
      birthDate: entity.birthDate,
      address: entity.address,
      parentPhone: entity.parentPhone,
      score: entity.score,
      avatarKey: entity.avatarKey,
      currentTopicId: entity.currentTopicId,
      currentCategoryId: entity.currentCategoryId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  toEntity(domain: Student): StudentEntity {
    const entity = new StudentEntity();
    entity.id = domain.getId();
    entity.userId = domain.getUserId();
    entity.username = domain.getUsername();
    entity.firstName = domain.getFirstName();
    entity.lastName = domain.getLastName();
    entity.birthDate = domain.getBirthDate();
    entity.address = domain.getAddress();
    entity.parentPhone = domain.getParentPhone();
    entity.score = domain.getScore();
    entity.avatarKey = domain.getAvatarKey();
    entity.currentTopicId = domain.getCurrentTopicId();
    entity.currentCategoryId = domain.getCurrentCategoryId();
    return entity;
  }
}
