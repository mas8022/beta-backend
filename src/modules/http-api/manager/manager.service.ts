import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma/prisma.service';
import { FindUserParamDto } from './dto/find-user-param.dto';
import type { FastifyRequest } from 'fastify';
import { BucketService } from 'src/common/services/bucket/bucket.service';
import { GetRequestsCollaborateDto } from './dto/get-request-collaborate.dto';
import { SetAuthorPermissionParamDto } from './dto/set-author-permission-param.dto';
import { SetAuthorPermissionBodyDto } from './dto/set-author-permission-body.dto';
import { GetContactUsMessageDto } from './dto/get-contact-us-message.dto';
import { GetAuthorsRequestsFunsDto } from './dto/get-authors-requests-funs.dto';
import { JalaliDateUtil } from 'src/common/utils/jalali-date.util';
import { GetCoursesDto } from './dto/get-courses.dto';
import { GetCoursesReportsDto } from './dto/get-courses-reports.dto';
import { RequestFunsDto } from './dto/request-funs.dto';

@Injectable()
export class ManagerService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly bucketService: BucketService,
  ) {}

  async findUser(param: FindUserParamDto) {
    const phone = param.phone;

    const user = await this.prismaService.user.findUnique({
      where: {
        phone,
      },
    });

    return {
      status: 200,
      data: user,
    };
  }

  async blockToggle(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: Number(userId),
      },
    });

    const updatedUser = await this.prismaService.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        status: user?.status === 'ACCESS' ? 'BLOCK' : 'ACCESS',
      },
    });

    return {
      status: 200,
      message:
        updatedUser.status === 'BLOCK' ? 'کاربر بلاک شد' : 'کاربر آزاد شد',
    };
  }

  async getContactUsComments(params: GetContactUsMessageDto) {
    const { search, roleFilter } = params;

    const where: any = {};

    if (search) {
      where.OR = [
        {
          email: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          phone: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (roleFilter !== 'ALL') {
      where.user = {
        roles: {
          has: roleFilter,
        },
      };
    }

    const comments = await this.prismaService.contactUs.findMany({
      where,
    });

    return { status: 200, data: comments };
  }

  async deleteContactUsComment(commentId: string) {
    await this.prismaService.contactUs.delete({
      where: {
        id: Number(commentId),
      },
    });

    return {
      status: 200,
      message: 'حذف شد',
    };
  }

  async getManagerProfile(req: FastifyRequest) {
    const profile = await req.manager;

    const grouped = await this.prismaService.course.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    const CoursesSortByStatus = grouped.reduce(
      (acc, item) => {
        if (item.status === 'creating') {
          acc.creatingCoursesCount = item._count.status;
        } else if (item.status === 'waiting') {
          acc.waitingCoursesCount = item._count.status;
        } else {
          acc.publishedCoursesCount = item._count.status;
        }

        return acc;
      },
      {
        creatingCoursesCount: 0,
        waitingCoursesCount: 0,
        publishedCoursesCount: 0,
      },
    );

    const [commentsCount, likesCount, coursesOrdersCount] = await Promise.all([
      this.prismaService.contactUs.count(),
      this.prismaService.like.count(),
      this.prismaService.courseOrder.count(),
    ]);

    return {
      status: 200,
      data: {
        profile,
        statistics: {
          ...CoursesSortByStatus,
          commentsCount,
          likesCount,
          coursesOrdersCount,
        },
      },
    };
  }

  async editProfile(files: any, { name, bio }: any, req: FastifyRequest) {
    const manager = await req.manager;

    let avatarAddress: string | null = null;
    if (files?.avatar?.[0]) {
      avatarAddress = await this.bucketService.uploadFile(files.avatar[0], [
        'image',
      ]);
    }

    const updateData: any = {
      name,
      bio,
    };

    if (avatarAddress) {
      updateData.avatar = avatarAddress;
    }

    await this.prismaService.user.update({
      where: {
        id: manager.id,
      },
      data: updateData,
    });

    return {
      status: 200,
      message: 'ویرایش با موفقیت انجام شد',
    };
  }

  async getRequestsCollaborate(query: GetRequestsCollaborateDto) {
    const { search, sort, role } = query;

    const where: any = {};

    if (role !== 'ALL') where.role = role;

    if (sort !== 'all') where.permission = sort;

    if (search) {
      where.OR = [
        {
          email: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          phone: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const requests = await this.prismaService.requestCollaborate.findMany({
      where,
    });

    return {
      status: 200,
      data: requests,
    };
  }

  async setCollaboratePermisson(
    { requestId, status }: SetAuthorPermissionParamDto,
    request: SetAuthorPermissionBodyDto,
  ) {
    if (status === 'rejected') {
      await this.prismaService.requestCollaborate.update({
        where: {
          id: Number(requestId),
        },
        data: {
          permission: 'rejected',
        },
      });
      return { status: 201, message: 'درخواست با موفقیت رد شد' };
    }

    await this.prismaService.requestCollaborate.update({
      where: {
        id: Number(requestId),
      },
      data: {
        permission: 'approved',
      },
    });

    const { phone, role } = request;

    const user: any = await this.prismaService.user.findUnique({
      where: { phone },
    });

    await this.prismaService.user.upsert({
      where: {
        phone,
      },
      update: {
        roles: Array.from(new Set([...user?.roles, role])),
      },
      create: {
        phone,
        roles: ['USER', role],
      },
    });

    return { status: 201, message: 'درخواست با موفقیت تایید شد' };
  }

  async deleteRequestCollaborate(requestId: string) {
    await this.prismaService.requestCollaborate.delete({
      where: {
        id: Number(requestId),
      },
    });

    return { status: 201, message: 'حذف شد' };
  }

  async getAuthorsRequestsFuns(query: GetAuthorsRequestsFunsDto) {
    const { search, status, role } = query;

    const where: any = { status };

    if (role !== 'ALL') {
      where.requester = {
        roles: { has: role },
      };
    }

    if (search?.trim()) {
      where.cardNumber = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const requests = await this.prismaService.requestFuns.findMany({
      where,
      orderBy: {
        id: 'desc',
      },
      take: 20,
    });

    return { status: 200, data: requests };
  }

  async accepteAuthorRequestFuns(requestId: string) {
    await this.prismaService.requestFuns.update({
      where: {
        id: Number(requestId),
      },
      data: {
        status: 'SUCCESS',
      },
    });

    return { status: 200, message: 'پذیرفته شد' };
  }

  async rejectAuthorRequestFuns(requestId: string) {
    await this.prismaService.requestFuns.update({
      where: {
        id: Number(requestId),
      },
      data: {
        status: 'REJECTED',
      },
    });

    return { status: 200, message: 'رد شد' };
  }

  async getFinancialsOverView(req: FastifyRequest) {
    const totalSell =
      (
        await this.prismaService.courseOrder.aggregate({
          where: { status: 'success' },
          _sum: {
            price: true,
          },
        })
      )._sum.price ?? 0;

    const manager = await req.manager;

    const totalManagerRequestsFuns =
      (
        await this.prismaService.requestFuns.aggregate({
          where: { requesterId: manager.id, status: 'SUCCESS' },
          _sum: {
            amount: true,
          },
        })
      )._sum.amount ?? 0;

    const walletBalance =
      totalSell * (30 / 100) - Number(totalManagerRequestsFuns);

    const authorsCount = await this.prismaService.user.count({
      where: {
        roles: {
          has: 'AUTHOR',
        },
      },
    });

    const RequestFunsCount = await this.prismaService.requestFuns.count({
      where: { status: 'PENDING' },
    });

    const totalPeymantsRequests =
      await this.prismaService.requestFuns.aggregate({
        where: {
          status: 'SUCCESS',
        },
        _sum: {
          amount: true,
        },
      });

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const totalSellSinceLastYear =
      await this.prismaService.courseOrder.findMany({
        where: { status: 'success', createdAt: { gte: oneYearAgo } },
        select: { price: true, createdAt: true },
      });

    // ----------- فروش تجمعی -----------
    let salesCumulative = 0;
    const monthlySales = [...Array(12)].map((_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (11 - i));

      const { monthName, year, monthIndex } = JalaliDateUtil.toJalaliMonth(d);

      const monthlyTotal = totalSellSinceLastYear
        .filter((o) => {
          const j = JalaliDateUtil.toJalaliMonth(o.createdAt);
          return j.year === year && j.monthIndex === monthIndex;
        })
        .reduce((sum, o) => sum + Number(o.price), 0);

      salesCumulative += monthlyTotal;
      return { month: monthName, total: salesCumulative };
    });

    // ----------- لاگین تجمعی -----------

    const students = await this.prismaService.user.findMany({
      select: { createdAt: true },
    });

    let loginCumulative = 0;
    const monthlyLogin = [...Array(12)].map((_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (11 - i));

      const { monthName, year, monthIndex } = JalaliDateUtil.toJalaliMonth(d);

      const monthlyCount = students.filter((o) => {
        const j = JalaliDateUtil.toJalaliMonth(o.createdAt);
        return j.year === year && j.monthIndex === monthIndex;
      }).length;

      loginCumulative += monthlyCount;
      return { month: monthName, studentscount: loginCumulative };
    });

    return {
      status: 200,
      data: {
        authorsCount,
        RequestFunsCount,
        totalPeymantsRequests: totalPeymantsRequests._sum.amount,
        monthlySales: monthlySales,
        monthlyLogin: monthlyLogin,
        walletBalance,
      },
    };
  }

  async getCourses(query: GetCoursesDto) {
    const { status, search } = query;

    let where: any = {};

    if (status === 'simpleEdit') {
      where.OR = [
        {
          lessons: {
            some: {
              status: 'waiting',
            },
          },
        },
        {
          lessons: {
            some: {
              episodes: {
                some: {
                  status: 'waiting',
                },
              },
            },
          },
        },
      ];
    } else {
      where = { status };
    }

    if (search?.trim()) {
      where.title = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const courses = await this.prismaService.course.findMany({
      where,
      omit: {
        requirements: true,
        whatYouLearn: true,
      },
      include: {
        _count: {
          select: {
            lessons: true,
            CourseOrder: {
              where: {
                status: 'success',
              },
            },
          },
        },
      },
    });

    return { status: 200, data: courses };
  }

  async getOverViewCourse(courseId: string) {
    const cousre = await this.prismaService.course.findUnique({
      where: {
        id: Number(courseId),
      },

      select: {
        id: true,
        image: true,
        title: true,
        category: true,
        description: true,
        price: true,
        originalPrice: true,
        requirements: true,
        whatYouLearn: true,
      },
    });

    return { status: 200, data: cousre };
  }

  async getCourseLessons(courseId: string) {
    const lessons = await this.prismaService.course.findUnique({
      where: {
        id: Number(courseId),
      },

      select: {
        id: true,
        status: true,
        lessons: {
          include: {
            episodes: {
              orderBy: {
                order: 'asc',
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return { status: 200, data: lessons };
  }

  async rejectCourse(courseId: string) {
    await this.prismaService.course.update({
      where: {
        id: Number(courseId),
      },
      data: {
        status: 'rejected',
      },
    });

    return { status: 201, message: 'دوره رد شد' };
  }

  async accepteCourse(courseId: string) {
    await this.prismaService.course.update({
      where: {
        id: Number(courseId),
      },
      data: {
        status: 'publish',
      },
    });

    return { status: 201, message: 'دوره پذیرفته شد' };
  }

  async rejectLesson(lessonId: string) {
    await this.prismaService.lesson.update({
      where: {
        id: Number(lessonId),
      },
      data: {
        status: 'rejected',
      },
    });

    return { status: 201, message: 'فصل رد شد' };
  }

  async accepteLesson(lessonId: string) {
    await this.prismaService.lesson.update({
      where: {
        id: Number(lessonId),
      },
      data: {
        status: 'publish',
      },
    });

    return { status: 201, message: 'فصل پذیرفته شد' };
  }

  async accepteEpisode(id: string) {
    await this.prismaService.episode.update({
      where: {
        id: Number(id),
      },
      data: {
        status: 'publish',
      },
    });

    return { status: 201, message: 'درس پذیرفته شد' };
  }

  async rejectEpisode(id: string) {
    await this.prismaService.episode.update({
      where: {
        id: Number(id),
      },
      data: {
        status: 'rejected',
      },
    });

    return { status: 201, message: 'درس رد شد' };
  }

  async sendCourseReport(
    courseId: string,
    message: string,
    req: FastifyRequest,
  ) {
    const manager = await req.manager;

    await this.prismaService.courseReport.create({
      data: {
        message,
        reporterId: manager.id,
        courseId: Number(courseId),
      },
    });

    return { status: 201, message: 'پیام ارسال شد' };
  }

  async getCoursesReports(query: GetCoursesReportsDto, req: FastifyRequest) {
    const { status, search } = query;

    const manager = await req.manager;

    const where: any = { reporterId: manager.id, status };

    if (search?.trim()) {
      where.course = {
        title: {
          contains: search,
          mode: 'insensitive',
        },
      };
    }

    const reports = await this.prismaService.courseReport.findMany({
      where,
      include: {
        course: {
          select: {
            title: true,
          },
        },
      },
    });

    return { status: 200, data: reports };
  }

  async accepteCorrectionCourseReport(reportId: string) {
    await this.prismaService.courseReport.update({
      where: { id: Number(reportId) },
      data: {
        status: 'ACCEPTE',
      },
    });

    return { status: 201, message: 'انجام شد' };
  }

  async deleteCorrectionCourseReport(reportId: string) {
    await this.prismaService.courseReport.delete({
      where: { id: Number(reportId) },
    });

    return { status: 201, message: 'حذف شد' };
  }

  async editRoles(roles: any, userId: string) {
    await this.prismaService.user.update({
      where: { id: Number(userId) },
      data: {
        roles: [...roles, 'USER'],
      },
    });

    return { status: 201, message: 'نقش ویرایش شد' };
  }

  async RequestFuns(req: FastifyRequest, RequestFunsDto: RequestFunsDto) {
    const manager = await req.manager;
    const { amount, cardNumber } = RequestFunsDto;

    const totalSell =
      (
        await this.prismaService.courseOrder.aggregate({
          where: { status: 'success' },
          _sum: {
            price: true,
          },
        })
      )._sum.price ?? 0;

    const totalManagerRequestsFuns =
      (
        await this.prismaService.requestFuns.aggregate({
          where: { requesterId: manager.id, status: 'SUCCESS' },
          _sum: {
            amount: true,
          },
        })
      )._sum.amount ?? 0;

    const walletBalance =
      totalSell * (30 / 100) - Number(totalManagerRequestsFuns);

    if (amount > walletBalance) {
      return { status: 400, message: 'موجودی کافی نیست' };
    }

    ///////////////////////////////////////////////////////////

    await this.prismaService.requestFuns.create({
      data: { requesterId: manager.id, amount, cardNumber, status: 'SUCCESS' },
    });

    return {
      status: 201,
      message: '😁 نوش جونت 😁',
    };
  }
}
