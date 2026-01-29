import { IsString } from 'class-validator';

export class createCourseCategoryDto {
  @IsString()
  category: string;
}
