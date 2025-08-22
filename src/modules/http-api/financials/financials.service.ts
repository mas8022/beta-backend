import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/services/prisma/prisma.service';
import type { FastifyRequest } from 'fastify';
import { ZibalService } from 'src/modules/services/zibal/zibal.service';

@Injectable()
export class FinancialsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly zibalService: ZibalService,
  ) {}

  async paymentRequest(id: string, req: FastifyRequest) {
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

    const { success, authority, paymentUrl } =
      await this.zibalService.createPayment(Number(course?.price), me.phone);

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
        authority: String(authority),
      },
    });

    return {
      status: 201,
      message: 'به درگاه پرداخت ارسال شدید',
      data: paymentUrl,
    };
  }

  async verifyPayment(authority: string) {
    const order = await this.prismaService.courseOrder.findUnique({
      where: { authority },
    });

    if (!order) {
      await this.prismaService.courseOrder.update({
        where: { authority },
        data: { status: 'failed' },
      });
      return { status: 404 };
    }

    const { success } = await this.zibalService.verifyPayment(
      String(order.authority),
    );

    if (!success) {
      await this.prismaService.courseOrder.update({
        where: { authority },
        data: { status: 'failed' },
      });
      return { status: 403 };
    }

    await this.prismaService.courseOrder.update({
      where: { authority },
      data: { status: 'success' },
    });

    return { status: 201 };
  }
}
