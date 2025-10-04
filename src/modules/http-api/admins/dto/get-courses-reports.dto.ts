import { IsEnum, IsOptional, IsString } from 'class-validator';

enum ReportStatusEnum {
  SEND = 'SEND',
  CORRECTION = 'CORRECTION',
}

export class GetCoursesReportsDto {
  @IsEnum(ReportStatusEnum)
  status: ReportStatusEnum;

  @IsOptional()
  @IsString()
  search?: string;
}
