import { Controller, Post, Body, Req } from '@nestjs/common';
import { ContactUsService } from './contact-us.service';
import { CreateContactUsDto } from './dto/create-contact-us.dto';
import type { FastifyRequest } from 'fastify';
import { Auth } from 'src/common/decorators/auth.decorator';

@Controller('contact-us')
export class ContactUsController {
  constructor(private readonly contactUsService: ContactUsService) {}

  @Auth('USER')
  @Post()
  async create(
    @Body() createContactUsDto: CreateContactUsDto,
    @Req() req: FastifyRequest,
  ) {
    return await this.contactUsService.create(createContactUsDto, req);
  }
}
