import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum RoleFilter {
  USER = 'USER',
  AUTHOR = 'AUTHOR',
  ALL = 'ALL',
}

export class GetContactUsMessageDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(RoleFilter)
  @IsOptional()
  roleFilter: RoleFilter;
}
