import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from 'src/modules/http-api/users/users.service';
import { ROLES_KEY } from '../keys/refelctors';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const req = context.switchToHttp().getRequest();

    const rawCookies = req.headers.cookie;

    if (!rawCookies)
      throw new HttpException('شناخته نشدید', HttpStatus.UNAUTHORIZED);

    const user = await this.userService.getMe(rawCookies);

    if (!user) throw new HttpException('شناخته نشدید', HttpStatus.UNAUTHORIZED);

    const hasAccess = requiredRoles.some((role: any) =>
      user.roles.includes(role),
    );

    if (!hasAccess)
      throw new HttpException('شما اجازه دسترسی ندارید', HttpStatus.FORBIDDEN);

    req.user = user;

    return true;
  }
}
