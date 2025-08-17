import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/services/prisma/prisma.service';
import { courseLesseons, courses } from 'staticData';
import { GetCoursesSearchParamsDto } from './dto/get-Courses-search-params.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class CoursesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UsersService,
  ) {}

  async createManyCourses() {
    try {
      await this.prismaService.course.createMany({
        data: courses,
      });

      await this.prismaService.lesson.createMany({
        data: courseLesseons,
      });

      return { status: 201 };
    } catch (error) {
      return { status: 500 };
    }
  }

  async findFilteredCourses(
    query: GetCoursesSearchParamsDto,
    rawCookies: string,
  ) {
    // گرفتن کاربر لاگین شده
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
        instructorAvatar: true,
        instructor: true,
        duration: true,
        originalPrice: true,
        _count: {
          select: {
            lessons: true,
            enrollments: true,
            like: me
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

    if (!me) {
      return { status: 403, message: 'اول در سایت ثبت نام کنید' };
    }

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
}
