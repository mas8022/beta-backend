import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { GetCoursesDto } from './dto/get-courses.dto';
import { AdminGuard } from './admin.guard';

@UseGuards(AdminGuard)
@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Get('courses')
  async getCourses(@Query() query: GetCoursesDto) {
    return await this.adminsService.getCourses(query);
  }
}
