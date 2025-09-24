import { IsOptional, IsEnum } from 'class-validator';

enum PermissionSortEnum {
  pending = 'pending',
  approved = 'approved',
  rejected = 'rejected',
  all = 'all',
}

enum RoleEnum {
  ALL = 'ALL',
  AUTHOR = 'AUTHOR',
  ADMIN = 'ADMIN',
}

export class GetRequestsCollaborateDto {
  @IsOptional()
  search?: string;

  @IsOptional()
  @IsEnum(PermissionSortEnum)
  sort?: PermissionSortEnum;

  @IsEnum(RoleEnum)
  role: RoleEnum;
}
