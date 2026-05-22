import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from '../../../../core/utils/base-response';

export class StudentResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  userId: string;

  @ApiProperty({ example: 'Bekzod-3y1' })
  username: string;

  @ApiProperty({ example: 'Bekzod' })
  firstName: string;

  @ApiProperty({ example: 'Karimov' })
  lastName: string;

  @ApiProperty({ example: 12000 })
  score: number;

  @ApiProperty({ example: '2018-05-15' })
  birthDate: string | null;

  @ApiProperty({ example: 'Toshkent sh., Yunusobod' })
  address: string;

  @ApiProperty({ example: '2026-03-12T23:27:17.000Z' })
  createdAt: Date;
}

export class NewStudentResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'Bekzod Karimov' })
  fullName: string;

  @ApiProperty({ example: 'Bekzod-3y1' })
  username: string;

  @ApiProperty({ example: 'j342k3j4l' })
  plainPassword: string | null;

  @ApiProperty({ example: 'wef435-e29b-dsds-324fd-423423423' })
  kindergartenId: string | null;
}

export class StudentObjectResponseDto extends BaseResponse {
  @ApiProperty({ type: StudentResponseDto })
  data: StudentResponseDto;
}

export class NewStudentObjectResponseDto extends BaseResponse {
  @ApiProperty({ type: NewStudentResponseDto })
  data: NewStudentResponseDto;
}

export class StudentArrayResponseDto extends BaseResponse {
  @ApiProperty({ type: [StudentResponseDto] })
  data: StudentResponseDto[];
}
