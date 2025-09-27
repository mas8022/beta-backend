import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma/prisma.service';
import type { FastifyRequest } from 'fastify';
import { ZibalService } from 'src/common/services/zibal/zibal.service';
import { AuthorRequestFunsDto } from './dto/author-request-funs.dto';
import { JalaliDateUtil } from 'src/common/utils/jalali-date.util';

@Injectable()
export class FinancialsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly zibalService: ZibalService,
  ) {}

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

  async authorRequestFuns(
    req: FastifyRequest,
    authorRequestFunsDto: AuthorRequestFunsDto,
  ) {
    const author = await req.author;
    const { amount, cardNumber } = authorRequestFunsDto;

    const totalIncomesResult = await this.prismaService.courseOrder.aggregate({
      where: { course: { authorId: author.id }, status: 'success' },
      _sum: { price: true },
    });
    const totalIncomes = totalIncomesResult._sum.price ?? 0;

    const totalWithdrawalsResult =
      await this.prismaService.authorRequestFuns.aggregate({
        where: { authorId: author.id, status: 'SUCCESS' },
        _sum: { amount: true },
      });
    const totalWithdrawals = totalWithdrawalsResult._sum.amount ?? 0;

    const walletBalance = totalIncomes - Number(totalWithdrawals);

    if (amount > walletBalance) {
      return { status: 400, message: 'موجودی کافی نیست' };
    }

    await this.prismaService.authorRequestFuns.create({
      data: { authorId: author.id, amount, cardNumber, status: 'PENDING' },
    });

    return {
      status: 201,
      message: 'یک الی دو روز اینده به حساب شما واریز می شود',
    };
  }

  async getAuthorWallet(req: FastifyRequest) {
    const author = await req.author;

    const totalIncomesResult = await this.prismaService.courseOrder.aggregate({
      where: {
        course: { authorId: author.id },
        status: 'success',
      },
      _sum: {
        price: true,
      },
    });

    const totalIncomes = totalIncomesResult._sum.price ?? 0;

    const totalWithdrawalsResult =
      await this.prismaService.authorRequestFuns.aggregate({
        where: { authorId: author.id, status: 'SUCCESS' },
        _sum: { amount: true },
      });
    const totalWithdrawals = totalWithdrawalsResult._sum.amount ?? 0;

    const walletBalance = totalIncomes - Number(totalWithdrawals);

    const totalWithdrawalsCount =
      await this.prismaService.authorRequestFuns.count({
        where: { authorId: author.id, status: 'SUCCESS' },
      });

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const orders = await this.prismaService.courseOrder.findMany({
      where: {
        course: { authorId: author.id },
        status: 'success',
        createdAt: { gte: oneYearAgo },
      },
      select: { price: true, createdAt: true },
    });

    const monthlySales: { month: string; total: number }[] = [];

    for (let i = 0; i < 12; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);

      const { monthName, year, monthIndex } = JalaliDateUtil.toJalaliMonth(d);

      const total = orders
        .filter((o) => {
          const j = JalaliDateUtil.toJalaliMonth(o.createdAt);
          return j.year === year && j.monthIndex === monthIndex;
        })
        .reduce((sum, o) => sum + Number(o.price), 0);

      monthlySales.push({ month: monthName, total });
    }

    return {
      status: 200,
      data: {
        totalIncomes,
        totalWithdrawals,
        walletBalance,
        totalWithdrawalsCount,
        monthlySales: monthlySales.reverse(),
      },
    };
  }
}
