import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../guards/roles.guard';

type RoleType = 'MANAGER' | 'ADMIN' | 'AUTHOR' | 'USER';

export const ROLES_KEY = 'roles';

export const Auth = (...roles: RoleType[]) => {
  return applyDecorators(SetMetadata(ROLES_KEY, roles), UseGuards(RolesGuard));
};
