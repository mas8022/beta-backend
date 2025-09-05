import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsBoolean()
  isFree: boolean;
}
