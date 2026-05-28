import {
  Controller,
  Get,
  Delete,
  Post,
  Body,
  Req,
  Param,
  Inject,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiExtraModels,
} from '@nestjs/swagger';
import {
  STUDENT_SERVICE,
  type IStudentService,
  INewStudent,
} from 'src/domain/student/service/student.service.interface';
import { Roles } from 'src/core/decorators/roles.decorator';
import { Role } from 'src/core/utils/role.enum';
import { CreateStudentDto } from '../model/request/create-student.dto';
import { ErrorResponse, ObjectResponse } from 'src/core/utils/base-response';
import {
  StudentObjectResponseDto,
  NewStudentObjectResponseDto,
} from '../model/response/student-response.dto';
import { StudentArrayResponseDto } from '../model/response/student-response.dto';
import { StudentProfileResponseDto } from '../model/response/student-profile-response.dto';
import { StudentWebMapper } from '../mapper/student-web.mapper';
import { JwtPayload } from 'src/infrastructure/jwt/jwt.strategy';

@ApiTags('Students')
@ApiBearerAuth()
@ApiExtraModels(
  StudentObjectResponseDto,
  NewStudentObjectResponseDto,
  StudentArrayResponseDto,
  StudentProfileResponseDto,
  ErrorResponse,
)
@Controller('students')
export class StudentController {
  constructor(
    @Inject(STUDENT_SERVICE)
    private readonly studentService: IStudentService,
    private readonly webMapper: StudentWebMapper,
  ) {}

  @Roles(Role.KINDERGARTEN_ADMIN)
  @Post('register')
  @ApiOperation({ summary: 'Register a new student' })
  @ApiResponse({
    status: 201,
    description: 'Student successfully registered',
    type: NewStudentObjectResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request', type: ErrorResponse })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorResponse,
  })
  async create(
    @Req() request: { user: JwtPayload },
    @Body() dto: CreateStudentDto,
  ) {
    const kindergartenId: string = request.user.kindergartenId;

    const newStudent: INewStudent = await this.studentService.createStudent(
      this.webMapper.toCreateParams(dto, kindergartenId),
    );

    return this.webMapper.toNewStudentObjectResonse(newStudent);
  }

  @Roles(Role.KINDERGARTEN_ADMIN)
  @Get()
  @ApiOperation({ summary: 'Get all students in the kindergarten' })
  @ApiResponse({
    status: 200,
    description: 'List of students',
    type: StudentArrayResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorResponse,
  })
  async findAll(@Req() request: { user: JwtPayload }) {
    const kindergartenId: string = request.user.kindergartenId;
    const students = await this.studentService.findAllStudents(kindergartenId);

    const response = new StudentArrayResponseDto();
    response.data = students.map((s) => this.webMapper.toResponseDto(s));
    return response;
  }

  @Roles(Role.KINDERGARTEN_ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a student' })
  @ApiResponse({ status: 200, description: 'Student deleted' })
  async delete(@Req() request: { user: JwtPayload }, @Param('id') id: string) {
    const kindergartenId: string = request.user.kindergartenId;

    const result: boolean = await this.studentService.delete(
      kindergartenId,
      id,
    );
    return new ObjectResponse(result);
  }

  @Roles(Role.STUDENT)
  @Delete()
  @ApiOperation({ summary: 'Delete a student' })
  @ApiResponse({ status: 200, description: 'Student deleted' })
  async deleteStudent(@Req() request: { student: JwtPayload }) {
    const kindergartenId: string = request.student.kindergartenId;
    const id: string = request.student.id;

    const result: boolean = await this.studentService.delete(
      kindergartenId,
      id,
    );
    return new ObjectResponse(result);
  }

  @Roles(Role.STUDENT)
  @Get('profile')
  @ApiOperation({ summary: 'Get current student profile' })
  @ApiResponse({
    status: 200,
    description: 'Student profile',
    type: StudentProfileResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorResponse,
  })
  async getProfile(@Req() request: { user: JwtPayload }) {
    const studentId = request.user.id;
    const student = await this.studentService.getStudentProfile(studentId);
    const response = new StudentProfileResponseDto();
    response.data = this.webMapper.toProfileDto(student);
    return response;
  }
}
