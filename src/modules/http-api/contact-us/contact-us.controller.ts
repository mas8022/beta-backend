import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ContactUsService } from './contact-us.service';
import { CreateContactUsDto } from './dto/create-contact-us.dto';
import type { FastifyRequest } from 'fastify';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('contact-us')
export class ContactUsController {
  constructor(private readonly contactUsService: ContactUsService) {}

  @UseGuards(RolesGuard)
  @Roles('USER')
  @Post()
  async create(
    @Body() createContactUsDto: CreateContactUsDto,
    @Req() req: FastifyRequest,
  ) {
    return await this.contactUsService.create(createContactUsDto, req);
  }
}
