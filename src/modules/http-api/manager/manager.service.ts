import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/services/prisma/prisma.service';
import { FindUserParamDto } from './dto/find-user-param.dto';
import type { FastifyRequest } from 'fastify';
import { BucketService } from 'src/modules/services/bucket/bucket.service';

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

  async getContactUsComments() {
    const comments = await this.prismaService.contactUs.findMany();

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
}
