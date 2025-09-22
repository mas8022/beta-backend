import { IsEnum, IsOptional, IsString } from "class-validator";

export class GetCoursesDto {
  @IsEnum(["creating", "waiting", "publish"])
  status: "creating" | "waiting" | "publish";

  @IsString()
  @IsOptional()
  search?: string;
}
