import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/services/prisma/prisma.service';
import type { FastifyRequest } from 'fastify';
import { ZibalService } from 'src/modules/services/zibal/zibal.service';
import { AuthorRequestFunsDto } from './dto/author-request-funs.dto';
import jalaali from 'jalaali-js';

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

    // محاسبه موجودی
    const totalIncomesResult = await this.prismaService.courseOrder.aggregate({
      where: { course: { authorId: author.id }, status: 'success' },
      _sum: { price: true },
    });
    const totalIncomes = totalIncomesResult._sum.price ?? 0;

    const totalWithdrawalsResult =
      await this.prismaService.authorRequestFuns.aggregate({
        where: { authorId: author.id, status: 'success' },
        _sum: { amount: true },
      });
    const totalWithdrawals = totalWithdrawalsResult._sum.amount ?? 0;

    const walletBalance = totalIncomes - Number(totalWithdrawals);

    if (amount > walletBalance) {
      return { status: 400, message: 'موجودی کافی نیست' };
    }

    // مرحله ۱: ایجاد درخواست برداشت
    const request = await this.prismaService.authorRequestFuns.create({
      data: { authorId: author.id, amount, cardNumber, status: 'pending' },
    });

    // مرحله ۲: تماس با سرویس زیبال
    const withdrawRes: any = await this.zibalService.withdraw(
      amount,
      cardNumber,
      'برداشت وجه نویسنده',
    );

    // مرحله ۳: اگر موفق نشد → آپدیت به failed
    if (!withdrawRes.success) {
      await this.prismaService.authorRequestFuns.update({
        where: { id: request.id },
        data: { status: 'failed' },
      });
      return { status: 400, message: withdrawRes.error };
    }

    // مرحله ۴: اگر موفق شد → آپدیت به success
    await this.prismaService.authorRequestFuns.update({
      where: { id: request.id },
      data: { status: 'success', transactionId: withdrawRes.trackId },
    });

    return { status: 201, message: 'برداشت وجه با موفقیت انجام شد' };
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
        where: { authorId: author.id, status: 'success' },
        _sum: { amount: true },
      });
    const totalWithdrawals = totalWithdrawalsResult._sum.amount ?? 0;

    const walletBalance = totalIncomes - Number(totalWithdrawals);

    const totalWithdrawalsCount =
      await this.prismaService.authorRequestFuns.count({
        where: { authorId: author.id, status: 'success' },
      });

    /////////////////////////////////////////////////////////////////////////////////////
    const persianMonths = [
      'فروردین',
      'اردیبهشت',
      'خرداد',
      'تیر',
      'مرداد',
      'شهریور',
      'مهر',
      'آبان',
      'آذر',
      'دی',
      'بهمن',
      'اسفند',
    ];
    function toJalaliMonth(date: Date) {
      const g = {
        gy: date.getFullYear(),
        gm: date.getMonth() + 1,
        gd: date.getDate(),
      };
      const { jy, jm } = jalaali.toJalaali(g.gy, g.gm, g.gd);
      return { year: jy, monthIndex: jm - 1, monthName: persianMonths[jm - 1] };
    }

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

      const { monthName, year, monthIndex } = toJalaliMonth(d);

      const total = orders
        .filter((o) => {
          const j = toJalaliMonth(o.createdAt);
          return j.year === year && j.monthIndex === monthIndex;
        })
        .reduce((sum, o) => sum + Number(o.price), 0);

      monthlySales.push({ month: monthName, total });
    }

    ////////////////////////////////////////////////////////////////////////

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
