import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma/prisma.service';
import type { FastifyRequest } from 'fastify';
import { ZibalService } from 'src/common/services/zibal/zibal.service';
import { AuthorRequestFunsDto } from './dto/author-request-funs.dto';
import jalaali from 'jalaali-js';
import { JalaliDateUtil } from 'src/common/utils/jalali-date.util';

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

    const existingOrder = await this.prismaService.courseOrder.findUnique({
      where: {
        userId_courseId: {
          userId: me.id,
          courseId: course.id,
        },
        status: 'success',
      },
    });

    if (!!existingOrder) {
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
        price: course.price,
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
