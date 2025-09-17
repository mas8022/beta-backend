import { IsEnum, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

enum AuthorPermissionStatus {
  approved = 'approved',
  rejected = 'rejected',
  pending = 'pending',
}

export class SetAuthorPermissionParamDto {
  @Type(() => Number)
  @IsInt()
  requestId: number;

  @IsEnum(AuthorPermissionStatus)
  status: AuthorPermissionStatus;
}
