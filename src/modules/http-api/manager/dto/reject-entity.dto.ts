import { IsEnum, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

enum EntityEnum {
  course = 'course',
  lesson = 'lesson',
  episode = 'episode',
}

export class RejectEntityDto {
  @Type(() => Number)
  @IsInt()
  confirmId: number;

  @Type(() => Number)
  @IsInt()
  entityId: number;

  @IsEnum(EntityEnum)
  type: EntityEnum;
}
