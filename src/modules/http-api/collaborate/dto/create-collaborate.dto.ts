import { ArrayMinSize, IsArray, IsBoolean, IsEmail, IsOptional, IsString, IsUrl, MinLength } from "class-validator";

export class CreateCollaborateDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsArray()
  @ArrayMinSize(1)
  roles: string[];

  @IsOptional()
  @IsString()
  experienceYears?: string;

  @IsOptional()
  @IsString()
  hoursPerWeek?: string;

  @IsString()
  expertise: string;

  @IsUrl()
  portfolioUrl: string;

  @IsOptional()
  @IsUrl()
  linkedin?: string;

  @IsOptional()
  @IsUrl()
  githubOrYoutube?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  message?: string;

  @IsBoolean()
  acceptTerms: boolean;
}
