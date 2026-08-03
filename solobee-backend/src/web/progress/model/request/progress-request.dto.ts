import { IsBoolean, IsOptional, IsString, ValidateIf } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ReportAttemptDto {
  @ApiPropertyOptional({
    description: 'Optional extra data',
    example: 'RED',
  })
  @IsOptional()
  @ValidateIf((_, value) => typeof value === 'string')
  @IsString()
  @ValidateIf((_, value) => typeof value === 'boolean')
  @IsBoolean()
  result?: string | boolean;
}
