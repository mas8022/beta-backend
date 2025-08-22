import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/services/prisma/prisma.service';
import { GetCoursesSearchParamsDto } from './dto/get-Courses-search-params.dto';
import { UsersService } from '../users/users.service';
import type { FastifyRequest } from 'fastify';
// import { courseLesseons, courses } from 'staticData';

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
    const author = await this.prismaService.author.create({
      data: {
        name: 'Test Author',
        bio: 'This is a sample author for testing purposes.',
        avatar: '/images/modern-workspace-library-ui.png',
      },
    });

    await this.prismaService.course.create({
      data: {
        title: 'Sample Course',
        image: '/images/modern-workspace-library-ui.png',
        category: 'فناوری',
        description: 'A sample course with lessons and episodes.',
        duration: 120,
        price: 100_000,
        originalPrice: 150_000,
        requirements: ['Basic Computer Knowledge', 'Internet Connection'],
        whatYouLearn: ['Learn basics', 'Understand core concepts'],
        authorId: author.id,
        lessons: {
          create: [
            {
              title: 'Lesson 1',
              duration: 60,
              order: 1,
              episodes: {
                create: [
                  {
                    title: 'Episode 1.1',
                    duration: 15,
                    description: 'Intro to Lesson 1',
                    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
                  },
                  {
                    title: 'Episode 1.2',
                    duration: 20,
                    description: 'Deep dive Lesson 1',
                    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
                  },
                ],
              },
            },
            {
              title: 'Lesson 2',
              duration: 60,
              order: 2,
              episodes: {
                create: [
                  {
                    title: 'Episode 2.1',
                    duration: 25,
                    description: 'Intro to Lesson 2',
                    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
                  },
                  {
                    title: 'Episode 2.2',
                    duration: 30,
                    description: 'Deep dive Lesson 2',
                    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
                  },
                  {
                    title: 'Episode 2.3',
                    duration: 10,
                    description: 'Wrap up Lesson 2',
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

  async findFilteredCourses(
    query: GetCoursesSearchParamsDto,
    rawCookies: string,
  ) {
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

    const where: any = {};

    // جستجو
    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    // دسته‌بندی
    if (selectedCategory && selectedCategory !== 'all') {
      where.category = selectedCategory;
    }

    // قیمت / رایگان
    if (showFreeOnly === 'true') {
      where.price = 0;
    } else {
      where.price = {
        gte: Number(minPrice),
        lte: Number(maxPrice),
      };
    }

    // مرتب‌سازی
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

    // کوئری Prisma
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
            enrollments: true,
            likes: me
              ? {
                  where: { userId: me.id },
                }
              : false,
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

    // اجرای toggle به شکل atomic با transaction
    return await this.prismaService.$transaction(async (prisma) => {
      // بررسی اینکه آیا قبلاً لایک شده
      const existingLike = await prisma.like.findUnique({
        where: {
          userId_courseId: {
            userId: me.id,
            courseId: courseIdNum,
          },
        },
      });

      if (existingLike) {
        // حذف لایک (dislike)
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
        // اضافه کردن لایک
        await prisma.like.create({
          data: { userId: me.id, courseId: courseIdNum },
        });
        return { status: 201, message: 'لایک شد', like: true };
      }
    });
  }

  async getCourse(courseId: string, rawCookie: string) {
    const course = await this.prismaService.course.findUnique({
      where: { id: Number(courseId) },
      include: {
        author: {
          omit: {
            createdAt: true,
            updatedAt: true,
          },
          include: {
            _count: {
              select: {
                courses: true,
              },
            },
          },
        },
        lessons: {
          include: {
            _count: {
              select: {
                episodes: true,
              },
            },
            episodes: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
            lessons: true,
            likes: true,
          },
        },
      },
    });

    const authorStudentsArray = await this.prismaService.enrollment.findMany({
      where: {
        course: {
          authorId: course?.authorId,
        },
      },
    });

    const authorStudents = authorStudentsArray.length;

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

  async findCoursesBySearchBar(search: string) {
    const courses = await this.prismaService.course.findMany({
      where: {
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
      take: 5,
    });

    return { status: 200, data: courses };
  }

  async createCourseComment(
    courseId: string,
    text: string,
    req: FastifyRequest,
  ) {
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
}
