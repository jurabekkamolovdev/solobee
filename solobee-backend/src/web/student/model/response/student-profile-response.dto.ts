import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from '../../../../core/utils/base-response';

export class StudentProfileDto {
  @ApiProperty({ example: 'Bekzod' })
  firstName: string;

  @ApiProperty({ example: 'Flutter' })
  lastName: string;

  @ApiProperty({ example: 12000 })
  score: number;
}

export class StudentProfileResponseDto extends BaseResponse {
  @ApiProperty({ type: StudentProfileDto })
  data: StudentProfileDto;
}
