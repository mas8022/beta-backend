import { IsEnum } from 'class-validator';

export class GetCoursesDto {
  @IsEnum(['creating', 'waiting', 'publish', 'simpleEdit'])
  status: 'creating' | 'waiting' | 'publish' | 'simpleEdit';

}
