import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const rawCookies = req.headers.cookie;

    if (!rawCookies) throw new UnauthorizedException('ابتدا ثبت نام کنید');

    const me = this.usersService.getMe(rawCookies);

    if (!me) throw new UnauthorizedException('ابتدا ثبت نام کنید');

    req.user = me;

    return true;
  }
}
