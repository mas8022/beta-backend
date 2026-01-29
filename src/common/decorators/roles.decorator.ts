import { SetMetadata } from '@nestjs/common';

type RoleType = 'MANAGER' | 'ADMIN' | 'AUTHOR' | 'USER';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: RoleType[]) => SetMetadata(ROLES_KEY, roles);
