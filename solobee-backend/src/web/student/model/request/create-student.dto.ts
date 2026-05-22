import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiProperty({ example: 'Aziz' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Karimov' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ example: '2018-05-15' })
  @IsNotEmpty()
  @IsDateString()
  birthDate: string;

  @ApiProperty({ example: 'Toshkent sh., Yunusobod t.' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ example: '+998901234567', required: false })
  @IsOptional()
  @IsString()
  parentPhone?: string;
}
