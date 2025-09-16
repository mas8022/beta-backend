import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthorGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const rawCookies = req.headers.cookie;

    if (!rawCookies) throw new UnauthorizedException('ابتدا ثبت نام کنید');

    const author = await this.usersService.getMe(rawCookies);

    const hasRole = author?.roles?.some((role: string) => role === 'AUTHOR');

    if (!hasRole) {
      throw new UnauthorizedException('شما اجازه دسترسی ندارید');
    }

    req.author = author;

    return true;
  }
}
