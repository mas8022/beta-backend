import { IsEnum, IsOptional, IsString } from 'class-validator';

enum StatusٍEnum {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  REJECTED = 'REJECTED',
}

enum RoleEnum {
  ALL = 'ALL',
  ADMIN = 'ADMIN',
  AUTHOR = 'AUTHOR',
}

export class GetAuthorsRequestsFunsDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(StatusٍEnum)
  status: StatusٍEnum;

  @IsEnum(RoleEnum)
  role: RoleEnum;
}
