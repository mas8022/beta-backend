import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

enum RoleEnum {
  USER = 'USER',
  AUTHOR = 'AUTHOR',
  ADMIN = 'ADMIN',
  ALL = 'ALL',
}

enum TopicEnum {
  ALL = 'ALL',
  GENERAL = 'GENERAL',
  REPORT = 'REPORT',
  TECHNICAL = 'TECHNICAL',
}

export class GetContactUsMessageDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(RoleEnum)
  role: RoleEnum;

  @IsEnum(TopicEnum)
  topic: TopicEnum;

   @IsOptional()
   @Type(() => Number)
   @IsInt()
   @Min(0)
   skip?: number;
 
   @IsOptional()
   @Type(() => Number)
   @IsInt()
   take?: number;

}
