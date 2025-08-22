import { Controller, Get, Headers, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserGuard } from './user.Guard';
import type { FastifyRequest } from 'fastify';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('me')
  async getMe(@Headers('cookie') rawCookies: string) {
    const result = await this.userService.getMe(rawCookies);
    return result;
  }

  @UseGuards(UserGuard)
  @Get("get-my-profile-data")
  async GetMyProfileData(@Req() req: FastifyRequest){
    return this.userService.GetMyProfileData(req)
  }
}
