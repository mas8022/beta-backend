// create-course.dto.ts
import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @MinLength(3, { message: 'عنوان دوره حداقل ۳ کاراکتر باشد' })
  title: string;

  @IsString()
  @MinLength(2, { message: 'دسته‌بندی الزامی است' })
  category: string;

  @IsString()
  @MinLength(10, { message: 'توزیحات دوره حداقل 10 کاراکتر باشد' })
  description: string;
}
