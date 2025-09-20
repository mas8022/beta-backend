import { Injectable } from '@nestjs/common';
import { CreateCollaborateDto } from './dto/create-collaborate.dto';
import { PrismaService } from 'src/common/services/prisma/prisma.service';

@Injectable()
export class CollaborateService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: CreateCollaborateDto) {
    await this.prismaService.requestCollaborate.create({
      data: {
        ...dto,
        permission: 'pending',
      },
    });

    return { status: 201, message: 'درخواست شماارسال شد' };
  }
}
