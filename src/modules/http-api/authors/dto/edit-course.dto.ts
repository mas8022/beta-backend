import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Max, IsArray, ArrayNotEmpty, ArrayMinSize } from "class-validator";

export class EditCourseDto {
  @IsOptional()
  @IsString({ message: "عنوان باید متن باشد" })
  @IsNotEmpty({ message: "عنوان نمی‌تواند خالی باشد" })
  title?: string;

  @IsOptional()
  @IsString({ message: "دسته‌بندی باید متن باشد" })
  @IsNotEmpty({ message: "دسته‌بندی نمی‌تواند خالی باشد" })
  category?: string;

  @IsOptional()
  @IsString({ message: "توضیحات باید متن باشد" })
  @IsNotEmpty({ message: "توضیحات نمی‌تواند خالی باشد" })
  description?: string;

  @IsOptional()
  @IsInt({ message: "قیمت باید عدد صحیح باشد" })
  @Min(0, { message: "قیمت نمی‌تواند منفی باشد" })
  price?: number;

  @IsOptional()
  @IsInt({ message: "قیمت اصلی باید عدد صحیح باشد" })
  @Min(0, { message: "قیمت اصلی نمی‌تواند منفی باشد" })
  originalPrice?: number;

  @IsOptional()
  @IsArray({ message: "پیش‌نیازها باید آرایه باشند" })
  @ArrayNotEmpty({ message: "پیش‌نیازها نمی‌توانند خالی باشند" })
  @ArrayMinSize(1, { message: "حداقل یک پیش‌نیاز باید وارد شود" })
  @IsString({ each: true, message: "هر پیش‌نیاز باید متن باشد" })
  requirements?: string[];

  @IsOptional()
  @IsArray({ message: "یادگیری‌ها باید آرایه باشند" })
  @ArrayNotEmpty({ message: "یادگیری‌ها نمی‌توانند خالی باشند" })
  @ArrayMinSize(1, { message: "حداقل یک مورد یادگیری باید وارد شود" })
  @IsString({ each: true, message: "هر مورد یادگیری باید متن باشد" })
  whatYouLearn?: string[];
}
