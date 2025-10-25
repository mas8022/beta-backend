import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

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
  
  @Type(() => Number)
  @IsInt()
  skip: number;

  @Type(() => Number)
  @IsInt()
  take: number;
}
