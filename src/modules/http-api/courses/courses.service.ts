import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/services/prisma/prisma.service';
import { GetCoursesSearchParamsDto } from './dto/get-Courses-search-params.dto';
import { UsersService } from '../users/users.service';
import type { FastifyRequest } from 'fastify';
import { Role } from '@prisma/client';

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
    const author = await this.prismaService.user.updateManyAndReturn({
      where: {
        roles: {
          has: Role.MANAGER,
        },
      },
      data: {
        name: 'Test Author',
        bio: 'This is a sample author for testing purposes.',
        avatar: '/images/modern-workspace-library-ui.png',
        roles: {
          push: Role.AUTHOR,
        },
      },
    });

    console.log('author[0]: ================', author);

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
        authorId: author[0].id,
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

    const where: any = {};

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
      where: { id: Number(courseId) },
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
          select: {
            id: true,
            user: {
              select: {
                phone: true,
              },
            },
            text: true,
            createdAt: true,
          },
        },
      },
    });

    const authorStudentsArray = await this.prismaService.courseOrder.findMany({
      where: {
        status: 'success',
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

  async findBySearchBar(search: string) {
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
      where: { id: Number(courseId) },
      select: {
        lessons: {
          orderBy: {
            id: 'asc',
          },
          select: {
            id: true,
            title: true,
            duration: true,
            isFree: true,
            _count: {
              select: { episodes: true },
            },
            episodes: {
              orderBy: {
                id: 'asc',
              },
              select: {
                id: true,
                title: true,
                duration: true,
                description: true,
                videoUrl: true,
              },
            },
          },
        },
      },
    });

    const me = await this.userService.getMe(rawCookies);

    let isOwn = false;
    if (me) {
      let myCoure: any = await this.prismaService.courseOrder.findFirst({
        where: {
          userId: me.id,
          courseId: Number(courseId),
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
