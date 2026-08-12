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
  score: number;

  @ApiProperty()
  avatar: string;
}

export class StudentProfileResponseDto extends BaseResponse {
  @ApiProperty({ type: StudentProfileDataDto })
  data: StudentProfileDataDto;
}

export class TimePlayedDto {
  @ApiProperty({
    example: 2,
    description: 'Bugun sarflangan vaqt — daqiqa qismi',
  })
  minutes: number;

  @ApiProperty({
    example: 18,
    description: 'Bugun sarflangan vaqt — soniya qismi',
  })
  seconds: number;
}

export class StudentStatisticsDto {
  @ApiProperty({
    example: 5,
    description: 'Bugun tugallangan activity-lar soni',
  })
  completedToday: number;

  @ApiProperty({
    type: TimePlayedDto,
    description: 'Bugun activity-larga sarflangan umumiy vaqt',
  })
  timePlayed: TimePlayedDto;

  @ApiProperty({
    example: 75,
    description:
      'Bugungi umumiy progress foizi (olingan ball / maksimal ball * 100)',
  })
  totalProgress: number;
}

export class StudentStatisticsResponseDto extends BaseResponse {
  @ApiProperty({ type: StudentStatisticsDto })
  declare data: StudentStatisticsDto;
}

export class DailyCompletionDto {
  @ApiProperty({ example: '2026-07-27' })
  date: string;

  @ApiProperty({ example: 3, description: 'Bajarilgan faoliyatlar soni' })
  completed: number;

  @ApiProperty({ example: 12, description: "Yig'ilgan yulduzlar soni" })
  starsEarned: number;
}

export class StudentWeeklyStatisticsDto {
  @ApiProperty({ example: '2026-07-27', description: 'Hafta boshi (Dushanba)' })
  weekStart: string;

  @ApiProperty({
    example: '2026-08-02',
    description: 'Hafta oxiri (Yakshanba)',
  })
  weekEnd: string;

  @ApiProperty({ type: [DailyCompletionDto] })
  days: DailyCompletionDto[];

  @ApiProperty({
    example: 75,
    description:
      "Haftalik umumiy progress foizi (yig'ilgan ball / maksimal ball * 100)",
  })
  totalProgress: number;

  @ApiProperty({
    example: 5,
    description:
      "Hafta davomida bir kunda bajarilgan eng ko'p faoliyatlar soni",
  })
  maxTaskCount: number;
}

export class StudentWeeklyStatisticsResponseDto extends BaseResponse {
  @ApiProperty({ type: StudentWeeklyStatisticsDto })
  declare data: StudentWeeklyStatisticsDto;
}
