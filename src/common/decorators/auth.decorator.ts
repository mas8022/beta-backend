import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../guards/roles.guard';
import { ROLES_KEY } from '../keys/refelctors';

type RoleType = 'MANAGER' | 'ADMIN' | 'AUTHOR' | 'USER';



export const Auth = (...roles: RoleType[]) => {
  return applyDecorators(SetMetadata(ROLES_KEY, roles), UseGuards(RolesGuard));
};
