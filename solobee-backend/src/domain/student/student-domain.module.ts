import { Module } from '@nestjs/common';
import { UserDomainModule } from '../user/user-domain.module';
import { STUDENT_SERVICE } from './service/student.service.interface';
import { StudentServiceImpl } from './service/student.service.impl';
import { StudentDatasourceModule } from 'src/datasource/student/student-datasource.module';
import { AvatarDomainModule } from '../avatar/avatar-domain.module';
import { StorageModule } from 'src/infrastructure/storage/storage.module';

@Module({
  imports: [
    UserDomainModule,
    StudentDatasourceModule,
    AvatarDomainModule,
    StorageModule,
  ],
  providers: [
    {
      provide: STUDENT_SERVICE,
      useClass: StudentServiceImpl,
    },
  ],
  exports: [STUDENT_SERVICE],
})
export class StudentDomainModule {}
