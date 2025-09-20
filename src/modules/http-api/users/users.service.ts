import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/services/prisma/prisma.service';
import { parse } from 'cookie';
import { JwtService } from '../../../common/services/jwt/jwt.service';
import type { FastifyRequest } from 'fastify';

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

  async GetMyProfileData(req: FastifyRequest) {
    const me = await req.user;

    const data = await this.prismaService.user.findUnique({
      where: { id: me.id },
      select: {
        phone: true,
        roles: true,
        Like: {
          select: {
            course: {
              select: {
                id: true,
                category: true,
                title: true,
                description: true,
                author: {
                  select: {
                    avatar: true,
                    name: true,
                  },
                },
                price: true,
                originalPrice: true,
              },
            },
          },
        },
        CourseOrder: {
          where: { status: 'success' },
          select: {
            course: {
              select: {
                id: true,
                category: true,
                title: true,
                description: true,
                author: {
                  select: {
                    avatar: true,
                    name: true,
                  },
                },
                price: true,
                originalPrice: true,
              },
            },
          },
        },
        CourseComment: {
          include: {
            course: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });

    return { status: 200, data };
  }
}
