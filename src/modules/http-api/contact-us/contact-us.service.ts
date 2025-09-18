import { Injectable } from '@nestjs/common';
import { CreateContactUsDto } from './dto/create-contact-us.dto';
import { PrismaService } from 'src/modules/services/prisma/prisma.service';
import type { FastifyRequest } from 'fastify';

@Injectable()
export class ContactUsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createContactUsDto: CreateContactUsDto, req: FastifyRequest) {
    const user = await req.user;

    await this.prismaService.contactUs.create({
      data: { ...createContactUsDto, userId: user.id },
    });

    return { status: 201, message: 'پیام ارسال شد' };
  }
}
