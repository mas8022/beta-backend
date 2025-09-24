import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsBoolean,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum AuthorPermissionStatus {
  approved = 'approved',
  rejected = 'rejected',
  pending = 'pending',
}

enum RoleEnum {
  AUTHOR = 'AUTHOR',
  ADMIN = 'ADMIN',
}

export class SetAuthorPermissionBodyDto {
  @Type(() => Number)
  @IsInt()
  id: number;

  @IsEnum(RoleEnum)
  role: RoleEnum;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  experienceYears?: string;

  @IsOptional()
  @IsString()
  hoursPerWeek?: string;

  @IsOptional()
  @IsString()
  expertise?: string;

  @IsOptional()
  @IsUrl()
  portfolioUrl?: string;

  @IsOptional()
  @IsString()
  linkedin?: string;

  @IsOptional()
  @IsString()
  githubOrYoutube?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsBoolean()
  acceptTerms?: boolean;

  @IsEnum(AuthorPermissionStatus, {
    message: 'permission must be one of: approved, rejected, pending',
  })
  permission: AuthorPermissionStatus;
}
