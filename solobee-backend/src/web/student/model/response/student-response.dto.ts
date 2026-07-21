import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from '../../../../core/utils/base-response';

export class StudentListItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  age: number;
}

export class StudentArrayResponseDto extends BaseResponse {
  @ApiProperty({ type: [StudentListItemResponseDto] })
  items: StudentListItemResponseDto[];

  @ApiProperty({ example: 42, description: 'Jami studentlar soni' })
  total: number;
}

export class StudentProfileDataDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  age: number;

  @ApiProperty()
  avatar: string;
}

export class StudentProfileResponseDto extends BaseResponse {
  @ApiProperty({ type: StudentProfileDataDto })
  data: StudentProfileDataDto;
}
