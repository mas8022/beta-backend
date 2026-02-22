import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma/prisma.service';

@Injectable()
export class SupervisorService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}


}
