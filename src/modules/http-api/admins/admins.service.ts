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
      where.lessons = {
        some: {
          status: 'waiting',
          episodes: {
            some: {
              status: 'waiting',
            },
          },
        },
      };
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
}
