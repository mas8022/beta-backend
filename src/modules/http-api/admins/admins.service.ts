import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma/prisma.service';
import { GetCoursesDto } from './dto/get-courses.dto';
import { GetCoursesReportsDto } from './dto/get-courses-reports.dto';
import type { FastifyRequest } from 'fastify';
import { RequestFunsDto } from './dto/request-funs.dto';

@Injectable()
export class AdminsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getCourses(query: GetCoursesDto) {
    const { status, search, take, skip } = query;

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
      skip: Number(skip),
      take: Number(take),
    });

    return { status: 200, data: courses };
  }

  async rejectCourse(courseId: string) {
    const course = await this.prismaService.course.update({
      where: {
        id: Number(courseId),
      },
      data: {
        status: 'rejected',
      },
    });

    return {
      status: 201,
      message: 'دوره رد شد',
      revalidateCoursePage: { title: course.title, id: course.id },
    };
  }

  async accepteCourse(courseId: string, req: FastifyRequest) {
    const admin = await req.admin;

    const course = await this.prismaService.course.findUnique({
      where: { id: Number(courseId) },
      select: {
        id: true,
        title: true,
        status: true,
        author: { select: { id: true } },
      },
    });

    if (!course || course.status === 'publish') {
      return { status: 405, message: 'قبلا تایید شده' };
    }

    await this.prismaService.$transaction(async (tx) => {
      await tx.adminConfirm.deleteMany({
        where: {
          courseId: Number(courseId),
        },
      });

      await tx.adminConfirm.create({
        data: {
          adminId: admin.id,
          authorId: course?.author.id!,
          courseId: Number(courseId),
        },
      });

      await tx.course.update({
        where: { id: Number(courseId) },
        data: { status: 'publish' },
      });
    });

    return {
      status: 201,
      message: 'دوره پذیرفته شد',
      revalidateCoursePage: { title: course.title, id: course.id },
    };
  }

  async sendCourseReport(
    courseId: string,
    message: string,
    req: FastifyRequest,
  ) {
    const admin = await req.admin;

    await this.prismaService.courseReport.create({
      data: {
        message,
        reporterId: admin.id,
        courseId: Number(courseId),
      },
    });

    return { status: 201, message: 'پیام ارسال شد' };
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

  async accepteEpisode(id: string, req: FastifyRequest) {
    const admin = await req.admin;

    const episode = await this.prismaService.episode.findUnique({
      where: { id: Number(id) },
      select: {
        status: true,
        lesson: {
          select: {
            course: { select: { author: { select: { id: true } } } },
          },
        },
      },
    });

    if (episode?.status === 'publish') {
      return { status: 405, message: 'قبلا تایید شده' };
    }

    await this.prismaService.$transaction(async (tx) => {
      await tx.adminConfirm.deleteMany({
        where: {
          episodeId: Number(id),
        },
      });

      await tx.adminConfirm.create({
        data: {
          adminId: admin.id,
          authorId: episode?.lesson.course.author.id!,
          episodeId: Number(id),
        },
      });

      await tx.episode.update({
        where: {
          id: Number(id),
        },
        data: {
          status: 'publish',
        },
      });
    });

    return { status: 201, message: 'درس پذیرفته شد' };
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

  async accepteLesson(lessonId: string, req: FastifyRequest) {
    const admin = await req.admin;

    const lesson = await this.prismaService.lesson.findUnique({
      where: { id: Number(lessonId) },
      select: {
        status: true,
        course: { select: { author: { select: { id: true } } } },
      },
    });

    if (lesson?.status === 'publish') {
      return { status: 405, message: 'قبلا تایید شده' };
    }

    await this.prismaService.$transaction(async (tx) => {
      await tx.adminConfirm.deleteMany({
        where: {
          lessonId: Number(lessonId),
        },
      });

      await tx.adminConfirm.create({
        data: {
          adminId: admin.id,
          authorId: lesson?.course.author.id!,
          lessonId: Number(lessonId),
        },
      });

      await tx.lesson.update({
        where: {
          id: Number(lessonId),
        },
        data: {
          status: 'publish',
        },
      });
    });

    return { status: 201, message: 'فصل پذیرفته شد' };
  }

  async getCoursesReports(query: GetCoursesReportsDto, req: FastifyRequest) {
    const { status, search, skip, take } = query;

    const admin = await req.admin;

    const where: any = { reporterId: admin.id, status: status };

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
      take: Number(take),
      skip: Number(skip),
    });

    return { status: 200, data: reports };
  }

  async deleteCorrectionCourseReport(reportId: string) {
    await this.prismaService.courseReport.delete({
      where: { id: Number(reportId) },
    });

    return { status: 201, message: 'حذف شد' };
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

  async getWallet(req: FastifyRequest) {
    const admin = await req.admin;

    const totalSell =
      (
        await this.prismaService.courseOrder.aggregate({
          where: { status: 'success' },
          _sum: {
            price: true,
          },
        })
      )._sum.price ?? 0;

    let totalAdminRequestsFuns =
      (
        await this.prismaService.requestFuns.aggregate({
          where: { requesterId: admin.id, status: 'SUCCESS' },
          _sum: {
            amount: true,
          },
        })
      )._sum.amount ?? 0;

    totalAdminRequestsFuns = Number(totalAdminRequestsFuns);

    const allReportsCount = await this.prismaService.courseReport.count({
      where: { status: 'ACCEPTE' },
    });
    const adminReportsCount = await this.prismaService.courseReport.count({
      where: { status: 'ACCEPTE', reporterId: admin.id },
    });

    const totalAdminIncome =
      totalSell * (5 / 100) * (adminReportsCount / allReportsCount);

    const walletBalance = totalAdminIncome - totalAdminRequestsFuns;

    return {
      status: 200,
      data: {
        totalAdminIncome,
        totalAdminRequestsFuns,
        walletBalance,
      },
    };
  }

  async RequestFuns(req: FastifyRequest, RequestFunsDto: RequestFunsDto) {
    const admin = await req.admin;
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

    const totalAdminRequestsFuns =
      (
        await this.prismaService.requestFuns.aggregate({
          where: { requesterId: admin.id, status: 'SUCCESS' },
          _sum: {
            amount: true,
          },
        })
      )._sum.amount ?? 0;

    const walletBalance =
      totalSell * (5 / 100) - Number(totalAdminRequestsFuns);

    if (amount > walletBalance) {
      return { status: 400, message: 'موجودی کافی نیست' };
    }

    await this.prismaService.requestFuns.create({
      data: { requesterId: admin.id, amount, cardNumber, status: 'PENDING' },
    });

    return {
      status: 201,
      message: 'یک الی دو روز اینده به حساب شما واریز می شود',
    };
  }
}
