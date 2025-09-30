import { IsEnum, IsOptional, IsString } from 'class-validator';

export class GetCoursesDto {
  @IsEnum(['creating', 'waiting', 'publish', 'simpleEdit'])
  status: 'creating' | 'waiting' | 'publish' | 'simpleEdit';

  @IsString()
  @IsOptional()
  search?: string;
}
