// create-promotion.dto.ts
import { IsString, IsNumber, Min, Max, IsDateString } from 'class-validator';

export class CreateCoursePromotionDto {
  @IsString()
  code: string;

  @IsNumber()
  @Min(1)
  @Max(100)
  percent: number;

  @IsNumber()
  @Min(1)
  usageLimit: number;

  @IsDateString()
  expireAt: string;

  @IsString()
  courseId: string;
}
