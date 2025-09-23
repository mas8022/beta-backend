import { IsEnum, IsOptional, IsString } from 'class-validator';

enum CourseReportStatusEnum {
  SEND = 'SEND',
  CORRECTION = 'CORRECTION',
  ACCEPTE = 'ACCEPTE',
  ALL = 'ALL',
}

export class GetCoursesReportsDto {
  @IsEnum(CourseReportStatusEnum)
  status: CourseReportStatusEnum;

  @IsOptional()
  @IsString()
  search?: string;
}
