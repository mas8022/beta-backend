import { Injectable } from '@nestjs/common';
import { CreateContactUsDto } from './dto/create-contact-us.dto';
import { PrismaService } from 'src/modules/services/prisma/prisma.service';

@Injectable()
export class ContactUsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createContactUsDto: CreateContactUsDto) {
    try {
      await this.prismaService.contactUs.create({ data: createContactUsDto });
      return { status: 201, messages: 'پیام ارسال شد' };
    } catch (error) {
      return { status: 500, messages: 'اینترنت خود را بررسی کنید' };
    }
  }
}
