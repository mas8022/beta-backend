import { HttpStatus, Injectable } from '@nestjs/common';
import { UserRoleEnum } from '@prisma/client';
import { PrismaService } from 'src/common/services/prisma/prisma.service';

@Injectable()
export class SupervisorService {
  constructor(private readonly prismaService: PrismaService) {}

  async editRoles(roles: UserRoleEnum[], userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'کاربر پیدا نشد',
      };
    }

    if (user.roles.includes('MANAGER')) {
      return {
        status: HttpStatus.FORBIDDEN,
        message: 'شما دسترسی به تغییر نقش های مدیر سایت ندارید',
      };
    }

    const finalRoles: UserRoleEnum[] = roles.filter(
      (role) => role !== 'MANAGER',
    );

    await this.prismaService.user.update({
      where: { id: Number(userId) },
      data: {
        roles: finalRoles,
      },
    });

    return { status: 201, message: 'نقش ویرایش شد' };
  }
}
