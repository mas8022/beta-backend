import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly usersServices: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const rawCookies = await req.headers.cookie;

    if (!rawCookies) throw new UnauthorizedException('ابتدا ثبت نام کنید');

    const admin = await this.usersServices.getMe(rawCookies);

    const hasRole = admin?.roles?.some((role) => role === 'ADMIN');

    if (!hasRole) throw new UnauthorizedException('شما اجازه دسترسی ندارید');

    req.admin = admin

    return true;
  }
}
