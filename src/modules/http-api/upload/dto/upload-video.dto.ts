import { IsNotEmpty, IsString } from 'class-validator';

export class UploadVideoDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;
}
