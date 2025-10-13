import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/services/prisma/prisma.service';
import { parse } from 'cookie';
import { JwtService } from '../../../common/services/jwt/jwt.service';
import type { FastifyRequest } from 'fastify';
import { ZibalService } from 'src/common/services/zibal/zibal.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly zibalService: ZibalService,
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

  async paymentRequest(id: string, req: FastifyRequest, promotionCode: string) {
    const me = await req.user;

    const course = await this.prismaService.course.findUnique({
      where: { id: Number(id) },
    });

    if (!course) {
      return {
        message: 'این دوره وجود ندارد',
        status: 404,
      };
    }

    const existingOrder = await this.prismaService.courseOrder.findFirst({
      where: {
        userId: me.id,
        courseId: course.id,
        status: 'success',
      },
    });

    if (existingOrder) {
      throw new ConflictException('شما قبلاً این دوره را سفارش داده‌اید');
    }

    let coursePrice = course.price;

    if (promotionCode) {
      const isExistPromotionCode = await this.prismaService.promotion.findFirst(
        {
          where: {
            code: promotionCode,
            expireAt: { gte: new Date() },
            usageLimit: { gt: 0 },
          },
        },
      );

      if (!isExistPromotionCode) {
        return { status: 400, message: 'کد تخفیف شما اعتبار ندارد' };
      }

      coursePrice -= coursePrice * (isExistPromotionCode.percent / 100);
    }

    const { success, authority, paymentUrl } =
      await this.zibalService.createPayment(coursePrice, me.phone);

    if (!success || !authority) {
      return {
        message: 'عملیات با شکست روبرو شد',
        status: 401,
      };
    }

    await this.prismaService.courseOrder.create({
      data: {
        userId: me.id,
        courseId: course.id,
        price: coursePrice,
        authority: String(authority),
        promotionCode,
      },
    });

    return {
      status: 201,
      message: 'به درگاه پرداخت ارسال شدید',
      data: paymentUrl,
    };
  }

  async verifyPayment(authority: string) {
    return await this.prismaService.$transaction(async (tx) => {
      const order = await tx.courseOrder.findUnique({
        where: { authority },
      });

      if (!order) {
        return { status: 404 };
      }

      // جلوگیری از دوباره کم شدن تخفیف
      if (order.status === 'success') {
        return { status: 200, message: 'قبلاً تایید شده' };
      }

      const { success } = await this.zibalService.verifyPayment(
        String(order.authority),
      );

      if (!success) {
        await tx.courseOrder.update({
          where: { authority },
          data: { status: 'failed' },
        });
        return { status: 403 };
      }

      if (order.promotionCode) {
        await tx.promotion.updateMany({
          where: { code: order.promotionCode, usageLimit: { gt: 0 } },
          data: { usageLimit: { decrement: 1 } },
        });
      }

      await tx.courseOrder.update({
        where: { authority },
        data: { status: 'success' },
      });

      return { status: 201 };
    });
  }
}
