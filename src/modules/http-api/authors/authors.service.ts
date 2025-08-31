import { Injectable } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { PocketService } from 'src/modules/services/pocket/pocket.service';
import { PrismaService } from 'src/modules/services/prisma/prisma.service';

@Injectable()
export class AuthorsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly pocketServic: PocketService,
  ) {}

  async getAuthorProfile(req: FastifyRequest) {
    const { id } = await req.author;

    const data = await this.prismaService.user.findUnique({
      where: { id },
      omit: {
        roles: true,
        createdAt: true,
        updatedAt: true,
      },
      include: {
        courses: {
          select: {
            status: true,
          },
        },
        _count: {
          select: {
            CourseComment: true,
            CourseOrder: {
              where: { status: 'success' },
            },
            Like: true,
          },
        },
      },
    });

    const coursesKindCount = data?.courses.reduce(
      (acc, course) => {
        if (course.status === 'publish') {
          acc.publishCoursesCount++;
        } else if (course.status === 'waiting') {
          acc.waitingCoursesCount++;
        } else {
          acc.creatingCoursesCount++;
        }
        return acc;
      },
      {
        publishCoursesCount: 0,
        waitingCoursesCount: 0,
        creatingCoursesCount: 0,
      },
    );

    return {
      status: 200,
      data: { ...data, coursesKindCount },
    };
  }

  async editProfile(files: any, { name, bio }: any, req: FastifyRequest) {
    const author = await req.author;

    let avatarAddress: string | null = null;
    if (files?.avatar?.[0]) {
      avatarAddress = await this.pocketServic.uploadFile(files.avatar[0]);
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
        id: author.id,
      },
      data: updateData,
    });

    return {
      status: 200,
      message: 'ویرایش با موفقیت انجام شد',
    };
  }

  async getAuthorComments(req: FastifyRequest) {
    const author = await req.author;

    const comments = await this.prismaService.courseComment.findMany({
      where: {
        course: { authorId: author.id },
      },
      select: {
        id: true,
        text: true,
        course: {
          select: {
            title: true,
          },
        },
        reply: true,
        status: true,
        user: {
          select: {
            phone: true,
          },
        },
        createdAt: true,
      },
    });

    return {
      status: 200,
      data: comments,
    };
  }

  async confirmComment(commentId: string) {
    await this.prismaService.courseComment.update({
      where: { id: Number(commentId) },
      data: {
        status: 'confirm',
      },
    });

    return {
      status: 200,
      message: 'نظر تایید شد',
    };
  }

  async rejectComment(commentId: string) {
    await this.prismaService.courseComment.update({
      where: { id: Number(commentId) },
      data: {
        status: 'rejected',
      },
    });

    return {
      status: 200,
      message: 'نظر رد شد',
    };
  }

  async replyComment(commentId: string, replyText: string) {
    await this.prismaService.courseComment.update({
      where: { id: Number(commentId) },
      data: {
        reply: replyText,
      },
    });

    return {
      status: 200,
      message: 'پاسخ ارسال شد',
    };
  }
}
