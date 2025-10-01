import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
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

  @Patch('reject-course/:id')
  async rejectCourse(@Param('id') id: string) {
    return await this.adminsService.rejectCourse(id);
  }

  @Patch('accepte-course/:id')
  async accepteCourse(@Param('id') id: string) {
    return await this.adminsService.accepteCourse(id);
  }

  @Post('send-course-report/:id')
  async sendCourseReport(
    @Param('id') id: string,
    @Body('message') message: string,
  ) {
    return await this.adminsService.sendCourseReport(id, message);
  }

  @Get('over-view-course/:id')
  async getOverViewCourse(@Param('id') id: string) {
    return this.adminsService.getOverViewCourse(id);
  }

  @Get('course-lessons/:id')
  async getCourseLessons(@Param('id') id: string) {
    return this.adminsService.getCourseLessons(id);
  }

  @Patch('reject-episode/:id')
  async rejectEpisode(@Param('id') id: string) {
    return await this.adminsService.rejectEpisode(id);
  }

  @Patch('accepte-episode/:id')
  async accepteEpisode(@Param('id') id: string) {
    return await this.adminsService.accepteEpisode(id);
  }

  @Patch('reject-lesson/:lessonId')
  async rejectLesson(@Param('lessonId') lessonId: string) {
    return await this.adminsService.rejectLesson(lessonId);
  }

  @Patch('accepte-lesson/:lessonId')
  async accepteLesson(@Param('lessonId') lessonId: string) {
    return await this.adminsService.accepteLesson(lessonId);
  }
}
