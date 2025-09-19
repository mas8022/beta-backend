import { IsEnum, IsOptional, IsString } from 'class-validator';

enum RequestStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  REJECTED = 'REJECTED',
}

export class GetAuthorsRequestsFunsDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(RequestStatus)
  status: RequestStatus;
}
