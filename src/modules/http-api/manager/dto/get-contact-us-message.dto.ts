import { IsEnum, IsOptional, IsString } from 'class-validator';

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
}
