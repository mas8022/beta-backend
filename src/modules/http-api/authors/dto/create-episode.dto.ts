import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateEpisodeDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;
}
