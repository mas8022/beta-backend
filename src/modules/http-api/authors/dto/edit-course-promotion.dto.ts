import { IsInt, IsISO8601, Min, Max } from 'class-validator';

export class EditCoursePromotionDto {
  @IsInt()
  @Min(1)
  @Max(100)
  percent: number;

  @IsISO8601()
  expireAt: string;

  @IsInt()
  @Min(1)
  usageLimit: number;
}
