import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../users/users.service';

@Injectable()
export class ManagerGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const rawCookies = req.headers.cookie;

    if (!rawCookies) throw new UnauthorizedException('شناخته نشدید');

    const manager = await this.usersService.getMe(rawCookies);

    if (!manager) throw new UnauthorizedException('شناخته نشدید');

    const hasRole = manager?.roles.some((role) => role === 'MANAGER') ?? false;

    if (!hasRole) throw new UnauthorizedException('شناخته نشدید');

    req.manager = manager;

    return true;
  }
}
