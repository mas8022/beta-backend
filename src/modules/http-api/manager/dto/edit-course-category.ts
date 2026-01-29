import { IsNumber, IsString } from 'class-validator';

export class EditCourseCategoryDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;
}
