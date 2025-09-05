import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class EditLessonDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsBoolean()
  isFree: boolean;
}
