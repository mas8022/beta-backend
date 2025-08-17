import { IsOptional, IsNumberString, IsString, IsBooleanString } from "class-validator";

export class GetCoursesSearchParamsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  selectedCategory?: string;

  @IsOptional()
  @IsNumberString()
  minPrice?: string;

  @IsOptional()
  @IsNumberString()
  maxPrice?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsBooleanString()
  showFreeOnly?: string;

  @IsOptional()
  @IsNumberString()
  skip?: string;   // اینو اضافه کن

  @IsOptional()
  @IsNumberString()
  take?: string;   // اینم اضافه کن
}
