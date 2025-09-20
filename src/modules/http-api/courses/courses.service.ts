import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma/prisma.service';
import { GetCoursesSearchParamsDto } from './dto/get-Courses-search-params.dto';
import { UsersService } from '../users/users.service';
import type { FastifyRequest } from 'fastify';
import { UserRoleEnum } from '@prisma/client';

@Injectable()
export class CoursesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UsersService,
  ) {}

  // async createManyCourses() {
  //   try {
  //     await this.prismaService.course.createMany({
  //       data: courses,
  //     });

  //     await this.prismaService.lesson.createMany({
  //       data: courseLesseons,
  //     });

  //     return { status: 201 };
  //   } catch (error) {
  //     return { status: 500 };
  //   }
  // }

  async createTestCourse() {
    await this.prismaService.course.create({
      data: {
        title: 'مهارت‌های زندگی روزمره',
        image: '/images/lifestyle-course-banner.png',
        category: 'سبک زندگی',
        description:
          'یک دوره کاربردی برای بهبود زندگی روزمره، مدیریت زمان و افزایش بهره‌وری شخصی.',
        duration: 100,
        price: 180_000,
        originalPrice: 300_000,
        requirements: ['علاقه به رشد فردی', 'تمایل به یادگیری مهارت‌های عملی'],
        whatYouLearn: [
          'مدیریت زمان و برنامه‌ریزی',
          'بهبود عادات روزانه',
          'تکنیک‌های افزایش بهره‌وری',
          'روش‌های ساده برای آرامش ذهنی',
        ],
        authorId: 1,
        lessons: {
          create: [
            {
              title: 'مقدمه‌ای بر سبک زندگی سالم',
              duration: 40,
              order: 1,
              episodes: {
                create: [
                  {
                    title: 'اصول زندگی متعادل',
                    duration: 15,
                    order: 1,
                    description: 'آشنایی با اصول حفظ تعادل در زندگی روزمره',
                    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
                  },
                  {
                    title: 'مدیریت استرس و آرامش ذهن',
                    duration: 25,
                    order: 2,
                    description: 'تمرین تکنیک‌های ساده برای کاهش استرس',
                    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
                  },
                ],
              },
            },
            {
              title: 'مهارت‌های ارتباطی مؤثر',
              duration: 50,
              order: 2, // اینو وسط اضافه کردم
              episodes: {
                create: [
                  {
                    title: 'گوش دادن فعال',
                    duration: 15,
                    order: 1,
                    description:
                      'یادگیری تکنیک‌های گوش دادن فعال برای ارتباط بهتر',
                    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
                  },
                  {
                    title: 'ارتباط غیرکلامی',
                    duration: 20,
                    order: 2,
                    description: 'درک زبان بدن و نشانه‌های غیرکلامی در گفتگوها',
                    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
                  },
                  {
                    title: 'حل تعارض‌ها',
                    duration: 15,
                    order: 3,
                    description: 'روش‌های ساده برای حل تعارض‌های روزمره',
                    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
                  },
                ],
              },
            },
            {
              title: 'بهبود عادات و بهره‌وری',
              duration: 60,
              order: 3,
              episodes: {
                create: [
                  {
                    title: 'عادت‌های روزانه موثر',
                    duration: 30,
                    order: 1,
                    description: 'روش‌های ایجاد عادت‌های مثبت در زندگی',
                    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
                  },
                  {
                    title: 'افزایش بهره‌وری شخصی',
                    duration: 30,
                    order: 2,
                    description: 'تکنیک‌های عملی برای انجام بهتر کارها',
                    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
                  },
                  {
                    title: 'افزایش بهره‌وری',
                    duration: 20,
                    order: 3,
                    description: 'تکنیک‌های عملی برای انجام بهتر',
                    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
                  },
                ],
              },
            },
          ],
        },
      },
    });

    return { status: 201, message: 'create test course successfully' };
  }

  async findFiltered(query: GetCoursesSearchParamsDto, rawCookies: string) {
    const me = await this.userService.getMe(rawCookies);

    const {
      search,
      selectedCategory,
      minPrice,
      maxPrice,
      sortBy,
      showFreeOnly,
      skip,
      take,
    } = query;

    const where: any = { status: 'publish' };

    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    if (selectedCategory && selectedCategory !== 'all') {
      where.category = selectedCategory;
    }

    if (showFreeOnly === 'true') {
      where.price = 0;
    } else {
      where.price = {
        gte: Number(minPrice),
        lte: Number(maxPrice),
      };
    }

    let orderBy: any = {};
    switch (sortBy) {
      case 'جدیدترین':
        orderBy = { createdAt: 'desc' };
        break;
      case 'گران‌ترین':
        orderBy = { price: 'desc' };
        break;
      case 'ارزان‌ترین':
        orderBy = { price: 'asc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    const courses = await this.prismaService.course.findMany({
      where,
      orderBy,
      select: {
        id: true,
        title: true,
        price: true,
        category: true,
        createdAt: true,
        description: true,
        image: true,
        duration: true,
        originalPrice: true,
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            bio: true,
          },
        },
        _count: {
          select: {
            lessons: true,
            likes: me
              ? {
                  where: { userId: me.id },
                }
              : false,
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

  async toggleLike(courseId: string, rawCookies: string) {
    const me: any = await this.userService.getMe(rawCookies);

    if (!me) return { status: 403, message: 'اول در سایت ثبت نام کنید' };

    const courseIdNum = Number(courseId);

    return await this.prismaService.$transaction(async (prisma) => {
      const existingLike = await prisma.like.findUnique({
        where: {
          userId_courseId: {
            userId: me.id,
            courseId: courseIdNum,
          },
        },
      });

      if (existingLike) {
        await prisma.like.delete({
          where: {
            userId_courseId: {
              userId: me.id,
              courseId: courseIdNum,
            },
          },
        });
        return { status: 200, message: 'لایک حذف شد', like: false };
      } else {
        await prisma.like.create({
          data: { userId: me.id, courseId: courseIdNum },
        });
        return { status: 201, message: 'لایک شد', like: true };
      }
    });
  }

  async getOne(courseId: string) {
    const course = await this.prismaService.course.findUnique({
      where: { id: Number(courseId), status: 'publish' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            bio: true,
            _count: {
              select: {
                courses: true,
              },
            },
          },
        },
        lessons: {
          where: { status: 'publish' },
          include: {
            _count: {
              select: {
                episodes: true,
              },
            },
            episodes: {
              omit: {
                videoUrl: true,
              },
            },
          },
        },
        _count: {
          select: {
            lessons: true,
            likes: true,
            CourseOrder: {
              where: {
                status: 'success',
              },
            },
          },
        },
        CourseComment: {
          where: { status: 'confirm' },
          select: {
            id: true,
            user: {
              select: {
                phone: true,
              },
            },
            text: true,
            reply: true,
            createdAt: true,
          },
          take: 10,
        },
      },
    });

    const authorStudents = await this.prismaService.courseOrder.count({
      where: {
        status: 'success',
        course: {
          authorId: course?.authorId,
        },
      },
    });

    const totalVideosCountInCourse = course?.lessons.reduce(
      (sum, item) => sum + item._count.episodes,
      0,
    );

    return {
      status: 200,
      data: {
        ...course,
        author: { ...course?.author, authorStudents },
        totalVideosCountInCourse,
      },
    };
  }

  async findBySearchBar(search: string) {
    const courses = await this.prismaService.course.findMany({
      where: {
        status: 'publish',
        OR: [
          {
            title: {
              contains: search,
              mode: 'insensitive',
            },
            description: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
      },
      take: 5,
    });

    return { status: 200, data: courses };
  }

  async createComment(courseId: string, text: string, req: FastifyRequest) {
    const me = await req.user;

    await this.prismaService.courseComment.create({
      data: {
        courseId: Number(courseId),
        text,
        userId: Number(me.id),
      },
    });

    return { status: 201, message: 'نظر شما برای بررسی ارسال شد' };
  }

  async deleteComment(commentId: string) {
    await this.prismaService.courseComment.delete({
      where: {
        id: Number(commentId),
      },
    });

    return { status: 200, message: 'نظر شما پاک شد' };
  }

  async getLessons(courseId: string, rawCookies: string) {
    const lessons = await this.prismaService.course.findUnique({
      where: { id: Number(courseId), status: 'publish' },
      select: {
        lessons: {
          where: { status: 'publish' },
          select: {
            id: true,
            title: true,
            duration: true,
            isFree: true,
            _count: {
              select: { episodes: true },
            },
            episodes: {
              select: {
                id: true,
                title: true,
                duration: true,
                description: true,
                videoUrl: true,
              },
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

    const me = await this.userService.getMe(rawCookies);

    let isOwn = false;
    if (me) {
      let myCoure: any = await this.prismaService.courseOrder.findUnique({
        where: {
          userId_courseId: {
            userId: me.id,
            courseId: Number(courseId),
          },
          status: 'success',
        },
      });

      isOwn = !!myCoure;
    }

    let processedLessons = lessons?.lessons.map((lesson) => ({
      ...lesson,
      episodes: lesson.episodes.map((ep) => ({
        ...ep,
        videoUrl: lesson.isFree || isOwn ? ep.videoUrl : undefined,
      })),
    }));

    return { status: 200, data: { lessons: processedLessons } };
  }
}
