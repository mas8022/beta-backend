import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma/prisma.service';
import { GetCoursesDto } from './dto/get-courses.dto';

@Injectable()
export class AdminsService {
  constructor(private readonly prismaService: PrismaService) {}

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

  async sendCourseReport(courseId: string, message: string) {
    const course = await this.prismaService.course.findUnique({
      where: {
        id: Number(courseId),
      },
      select: {
        author: {
          select: {
            id: true,
          },
        },
      },
    });

    const authorId = course?.author.id;

    if (!authorId) {
      return { status: 201, message: 'نویسنده این دوره اخراج شده' };
    }

    await this.prismaService.courseReport.create({
      data: {
        message,
        authorId,
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
}
