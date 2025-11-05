import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

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

export class GetRequestsFunsDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(StatusٍEnum)
  status: StatusٍEnum;

  @IsEnum(RoleEnum)
  role: RoleEnum;

  @Type(() => Number)
  @IsInt()
  skip: number;

  @Type(() => Number)
  @IsInt()
  take: number;
}
