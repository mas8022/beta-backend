import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ContactUsService } from './contact-us.service';
import { CreateContactUsDto } from './dto/create-contact-us.dto';
import { UserGuard } from '../users/user.Guard';
import type { FastifyRequest } from 'fastify';

@Controller('contact-us')
export class ContactUsController {
  constructor(private readonly contactUsService: ContactUsService) {}

  @UseGuards(UserGuard)
  @Post()
  async create(
    @Body() createContactUsDto: CreateContactUsDto,
    @Req() req: FastifyRequest,
  ) {
    return await this.contactUsService.create(createContactUsDto, req);
  }
}
