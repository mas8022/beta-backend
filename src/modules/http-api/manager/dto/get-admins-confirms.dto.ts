import { IsEnum, IsOptional, IsString } from 'class-validator';

enum ConfirmTypeEnum {
  course = 'course',
  lesson = 'lesson',
  episode = 'episode',
}

export class GetAdminsConfirmsDto {
  @IsEnum(ConfirmTypeEnum)
  type: ConfirmTypeEnum;

  @IsString()
  @IsOptional()
  search?: string;
}
