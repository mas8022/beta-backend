import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class EpisodeDto {
  @IsNotEmpty()
  @IsString()
  key!: string;
  
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;
}
