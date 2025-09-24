import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
  Matches,
  IsEnum,
} from 'class-validator';

export enum RoleEnum {
  ADMIN = 'ADMIN',
  AUTHOR = 'AUTHOR',
}

export class CreateCollaborateDto {
  @IsString({ message: 'نام باید رشته باشد.' })
  @MinLength(3, { message: 'نام و نام خانوادگی را کامل وارد کنید.' })
  name: string;

  @IsEmail({}, { message: 'ایمیل معتبر نیست.' })
  email: string;

  @IsString()
  phone: string;

  @IsString()
  experienceYears: string;

  @IsString()
  hoursPerWeek: string;

  @IsString()
  @MinLength(2, { message: 'حوزه‌های تخصص را وارد کنید.' })
  expertise: string;

  @IsOptional()
  @Matches(/^$|^https?:\/\/.*$/, {
    message: 'لینک نمونه‌کار معتبر نیست.',
  })
  portfolioUrl: string;

  @IsEnum(RoleEnum, { message: 'نقش انتخاب‌شده معتبر نیست.' })
  role: RoleEnum;

  @IsOptional()
  @IsUrl({}, { message: 'لینک LinkedIn معتبر نیست.' })
  linkedin?: string;

  @IsOptional()
  @IsUrl({}, { message: 'لینک معتبر نیست.' })
  githubOrYoutube?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsString()
  @MinLength(10, { message: 'حداقل ۱۰ کاراکتر وارد کنید.' })
  message: string;

  @IsBoolean()
  acceptTerms: boolean;
}
