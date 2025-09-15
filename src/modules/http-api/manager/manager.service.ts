import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/services/prisma/prisma.service';
import { FindUserParamDto } from './dto/find-user-param.dto';

@Injectable()
export class ManagerService {
  constructor(private readonly prismaService: PrismaService) {}

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
}
