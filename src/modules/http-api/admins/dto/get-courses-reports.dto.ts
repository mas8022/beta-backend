import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

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

  @Type(() => Number)
  @IsInt()
  skip?: number;
  
  @Type(() => Number)
  @IsInt()
  take?: number;
}
