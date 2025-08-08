import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma/prisma.service';
import { parse } from 'cookie';
import { JwtService } from '../../services/jwt/jwt.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async getMe(rawCookies: string) {
    try {
      const { access_token } = parse(rawCookies || '');

      const { id } = this.jwtService.verifyAccessToken(access_token!);

      const me = await this.prismaService.user.findUnique({ where: { id } });

      return me;
    } catch (error) {
      return null;
    }
  }
}
