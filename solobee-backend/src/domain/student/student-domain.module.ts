import { Module } from '@nestjs/common';
import { UserDomainModule } from '../user/user-domain.module';
import { STUDENT_SERVICE } from './service/student.service.interface';
import { StudentServiceImpl } from './service/student.service.impl';
import { StudentDatasourceModule } from 'src/datasource/student/student-datasource.module';

@Module({
  imports: [UserDomainModule, StudentDatasourceModule],
  providers: [
    {
      provide: STUDENT_SERVICE,
      useClass: StudentServiceImpl,
    },
  ],
  exports: [STUDENT_SERVICE],
})
export class StudentDomainModule {}
