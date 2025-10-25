import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class GetCoursesDto {
  @IsEnum(['creating', 'waiting', 'publish', 'simpleEdit'])
  status: 'creating' | 'waiting' | 'publish' | 'simpleEdit';

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
