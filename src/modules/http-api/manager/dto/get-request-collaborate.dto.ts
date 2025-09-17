import { IsOptional, IsEnum } from 'class-validator';

enum PermissionSortEnum {
  pending = 'pending',
  approved = 'approved',
  rejected = 'rejected',
  all = 'all',
}

export class GetRequestsCollaborateDto {
  @IsOptional()
  search?: string;

  @IsOptional()
  @IsEnum(PermissionSortEnum)
  sort?: PermissionSortEnum;
}
