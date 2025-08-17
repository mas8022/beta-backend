import { Controller, Get, Headers, Post, Res } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('me')
  async getMe(@Headers('cookie') rawCookies: string) {
    const result = await this.userService.getMe(rawCookies);
    return result;
  }
}
