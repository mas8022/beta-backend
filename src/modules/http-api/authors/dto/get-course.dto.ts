import { Type } from 'class-transformer';
import { IsEnum, IsInt } from 'class-validator';

export class GetCoursesDto {
  @IsEnum(['creating', 'waiting', 'publish', 'simpleEdit'])
  status: 'creating' | 'waiting' | 'publish' | 'simpleEdit';

  @Type(() => Number)
  @IsInt()
  skip?: Number;

  @Type(() => Number)
  @IsInt()
  take?: Number;
}
