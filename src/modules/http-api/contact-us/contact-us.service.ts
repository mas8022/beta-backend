import { Injectable } from '@nestjs/common';
import { CreateContactUsDto } from './dto/create-contact-us.dto';
import { PrismaService } from 'src/modules/services/prisma/prisma.service';

@Injectable()
export class ContactUsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createContactUsDto: CreateContactUsDto) {
    await this.prismaService.contactUs.create({ data: createContactUsDto });

    return { status: 201, message: 'پیام ارسال شد' };
  }
}
