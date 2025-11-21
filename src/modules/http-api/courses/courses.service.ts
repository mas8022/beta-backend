import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma/prisma.service';
import { GetCoursesSearchParamsDto } from './dto/get-Courses-search-params.dto';
import { UsersService } from '../users/users.service';
import type { FastifyRequest } from 'fastify';
import { RedisService } from 'src/common/services/redis/redis.service';

@Injectable()
export class CoursesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UsersService,
    private readonly redisService: RedisService,
  ) {}

  async addTestCourses() {
    const courseCategories = ['فناوری', 'کسب‌وکار', 'هنر', 'سبک زندگی'];

    const courseTitles = [
      'مبانی برنامه‌نویسی مدرن',
      'مدیریت زمان در محیط کار',
      'اصول طراحی گرافیکی خلاق',
      'توسعه مهارت‌های ارتباطی',
      'آشنایی با هوش مصنوعی',
      'راه‌اندازی کسب‌وکار آنلاین',
      'نقاشی دیجیتال برای مبتدیان',
      'تکنیک‌های تمرکز و بهره‌وری',
      'برنامه‌نویسی وب با جاوااسکریپت',
      'بازاریابی در شبکه‌های اجتماعی',
      'عکاسی هنری با موبایل',
      'بهبود سبک زندگی سالم',
      'آموزش فریم‌ورک React',
      'اصول برند شخصی',
      'ویرایش ویدیو برای تولید محتوا',
    ];

    let courseCount = 0;

    // ساخت حداقل ۳۰ دوره با ترکیب عنوان‌ها و دسته‌ها
    while (courseCount < 30) {
      for (let i = 0; i < courseTitles.length && courseCount < 30; i++) {
        const title = courseTitles[i];
        const category =
          courseCategories[courseCount % courseCategories.length];
        courseCount++;

        await this.prismaService.course.create({
          data: {
            status: 'publish',
            title: `${title} - نسخه ${courseCount}`,
            image: `https://picsum.photos/seed/course${courseCount}/600/400`,
            category,
            description: `در این دوره با مفاهیم ${title} آشنا می‌شوید و یاد می‌گیرید چگونه آن را در دنیای واقعی به کار ببرید.`,
            duration: 90 + (courseCount % 40),
            price: 150_000 + courseCount * 5_000,
            originalPrice: 300_000 + courseCount * 5_000,
            requirements: [
              'تمایل به یادگیری موضوعات جدید',
              'دسترسی به اینترنت و کامپیوتر',
            ],
            whatYouLearn: [
              `آشنایی کامل با مفاهیم ${title}`,
              'تمرین‌های عملی برای یادگیری عمیق‌تر',
              'تکنیک‌های حرفه‌ای در دنیای واقعی',
              'نکات کاربردی برای پیشرفت شخصی و شغلی',
            ],
            authorId: 1,
            lessons: {
              create: [
                {
                  status: 'publish',
                  title: 'مقدمه و شناخت موضوع',
                  duration: 30,
                  order: 1,
                  episodes: {
                    create: [
                      {
                        status: 'publish',
                        title: 'آشنایی اولیه با مفاهیم',
                        duration: 15,
                        order: 1,
                        description:
                          'در این قسمت مقدمه‌ای از موضوع اصلی دوره ارائه می‌شود.',
                        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
                      },
                      {
                        status: 'publish',
                        title: 'مروری بر اهمیت این مهارت',
                        duration: 15,
                        order: 2,
                        description:
                          'بررسی دلایل اهمیت یادگیری این مهارت در زندگی کاری و شخصی.',
                        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
                      },
                    ],
                  },
                },
                {
                  status: 'publish',
                  title: 'آموزش و تمرین عملی',
                  duration: 40,
                  order: 2,
                  episodes: {
                    create: [
                      {
                        status: 'publish',

                        title: 'تمرین‌های کاربردی',
                        duration: 20,
                        order: 1,
                        description:
                          'در این بخش تمرین‌هایی عملی برای تسلط بیشتر روی مفاهیم ارائه می‌شود.',
                        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
                      },
                      {
                        status: 'publish',

                        title: 'رفع اشکال و نکات پیشرفته',
                        duration: 20,
                        order: 2,
                        description:
                          'آشنایی با اشتباهات رایج و نکات مهم در اجرای صحیح مهارت.',
                        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
                      },
                    ],
                  },
                },
                {
                  status: 'publish',
                  title: 'جمع‌بندی و پروژه نهایی',
                  duration: 30,
                  order: 3,
                  episodes: {
                    create: [
                      {
                        status: 'publish',
                        title: 'مرور نکات کلیدی',
                        duration: 15,
                        order: 1,
                        description:
                          'مروری کوتاه بر مهم‌ترین نکات آموزش داده‌شده در طول دوره.',
                        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
                      },

                      {
                        status: 'publish',
                        title: 'پروژه نهایی',
                        duration: 15,
                        order: 2,
                        description:
                          'در این قسمت یک پروژه عملی کوچک برای تمرین نهایی انجام می‌دهید.',
                        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
                      },
                    ],
                  },
                },
              ],
            },
          },
        });
      }
    }

    return {
      status: 201,
      message: `${courseCount} test courses created successfully`,
    };
  }

  async findFiltered(query: GetCoursesSearchParamsDto) {
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
                episodes: {
                  where: { status: 'publish' },
                },
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
            lessons: {
              where: { status: 'publish' },
            },
            likes: true,
            CourseOrder: {
              where: {
                status: 'success',
              },
            },
          },
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

    const duration =
      (
        await this.prismaService.episode.aggregate({
          where: {
            status: 'publish',
            lesson: {
              courseId: course?.id,
            },
          },
          _sum: {
            duration: true,
          },
        })
      )._sum.duration ?? 0;

    return {
      status: 200,
      data: {
        ...course,
        duration,
        author: { ...course?.author, authorStudents },
        totalVideosCountInCourse,
      },
    };
  }

  async getCourseLikeBtn(courseId: string, rawCookies: string) {
    let isLiked: boolean = false;
    const me = await this.userService.getMe(rawCookies);

    const course = await this.prismaService.course.findUnique({
      where: { id: Number(courseId) },
    });

    if (me && course) {
      isLiked = (await this.prismaService.like.findUnique({
        where: {
          userId_courseId: {
            userId: me.id,
            courseId: course.id,
          },
        },
      }))
        ? true
        : false;
    }

    return { status: 200, data: isLiked };
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
          },
          {
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
    const me = await this.userService.getMe(rawCookies);

    const isOwn = me
      ? !!(await this.prismaService.courseOrder.findFirst({
          where: { userId: me.id, courseId: +courseId, status: 'success' },
        }))
      : false;

    const key = `cache:courses:get-course-lessons-${courseId}`;

    const cacheData = await this.redisService.get(key);

    if (!isOwn && cacheData) {
      return { status: 200, data: JSON.parse(cacheData) };
    }

    const course = await this.prismaService.course.findUnique({
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
              where: { status: 'publish' },
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

    if (!course) return { status: 404, message: 'این دوره وجود ندارد' };

    let processedLessons = course?.lessons.map((lesson) => ({
      ...lesson,
      episodes: lesson.episodes.map((ep) => ({
        ...ep,
        videoUrl: lesson.isFree || isOwn ? ep.videoUrl : undefined,
      })),
    }));

    if (!isOwn) {
      await this.redisService.set(
        `cache:courses:get-course-lessons-${courseId}`,
        processedLessons,
      );
    }

    return { status: 200, data: processedLessons };
  }

  async getAuthorPublishCourses(authorId: string) {
    const courses = await this.prismaService.course.findMany({
      where: { authorId: Number(authorId), status: 'publish' },
      select: {
        id: true,
        image: true,
        category: true,
        title: true,
        description: true,
        price: true,
        originalPrice: true,
      },
    });

    return { status: 200, data: courses };
  }

  async getSiteMap() {
    const courses = await this.prismaService.course.findMany({
      where: {
        status: 'publish',
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return { status: 200, data: courses };
  }

  async getComments(courseId: string, query: any) {
    const { skip, take } = query;

    const comments = await this.prismaService.courseComment.findMany({
      where: { courseId: Number(courseId), status: 'confirm' },
      select: {
        id: true,
        user: { select: { phone: true } },
        text: true,
        reply: true,
        createdAt: true,
      },
      skip: Number(skip),
      take: Number(take),
    });

    const maskPhone = (phone: string) =>
      phone.replace(/^(\d{4})\d{4}(\d+)$/, '$1xxxx$2');

    const data = comments.map((comment) => ({
      ...comment,
      user: {
        ...comment.user,
        phone: maskPhone(comment.user.phone),
      },
    }));

    return {
      status: 200,
      data,
    };
  }
}
