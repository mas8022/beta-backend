import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { GetCoursesDto } from './dto/get-courses.dto';
import { AdminGuard } from './admin.guard';
import { GetCoursesReportsDto } from './dto/get-courses-reports.dto';
import type { FastifyRequest } from 'fastify';
import { RequestFunsDto } from './dto/request-funs.dto';
import { ClearCacheInterceptor } from 'src/common/interceptors/clear-cache.interceptor';
import { ClearCacheCourseLessonsInterceptor } from 'src/common/interceptors/clear-cache-course-lessons.interceptor';

@UseGuards(AdminGuard)
@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Get('courses')
  async getCourses(@Query() query: GetCoursesDto) {
    return await this.adminsService.getCourses(query);
  }

  @UseInterceptors(ClearCacheInterceptor('cache:courses:*'))
  @Patch('reject-course/:id')
  async rejectCourse(@Param('id') id: string) {
    return await this.adminsService.rejectCourse(id);
  }

  @UseInterceptors(ClearCacheInterceptor('cache:courses:*'))
  @Patch('accepte-course/:id')
  async accepteCourse(@Param('id') id: string, @Req() req: FastifyRequest) {
    return await this.adminsService.accepteCourse(id, req);
  }

  @Post('send-course-report/:id')
  async sendCourseReport(
    @Param('id') id: string,
    @Body('message') message: string,
    @Req() req: FastifyRequest,
  ) {
    return await this.adminsService.sendCourseReport(id, message, req);
  }

  @Get('over-view-course/:id')
  async getOverViewCourse(@Param('id') id: string) {
    return this.adminsService.getOverViewCourse(id);
  }

  @Get('course-lessons/:id')
  async getCourseLessons(@Param('id') id: string) {
    return this.adminsService.getCourseLessons(id);
  }

  @UseInterceptors(ClearCacheCourseLessonsInterceptor)
  @Patch('reject-episode/:episodeId')
  async rejectEpisode(@Param('episodeId') id: string) {
    return await this.adminsService.rejectEpisode(id);
  }

  @UseInterceptors(ClearCacheCourseLessonsInterceptor)
  @Patch('accepte-episode/:episodeId')
  async accepteEpisode(@Param('episodeId') id: string, @Req() req: FastifyRequest) {
    return await this.adminsService.accepteEpisode(id, req);
  }

  @UseInterceptors(ClearCacheCourseLessonsInterceptor)
  @Patch('reject-lesson/:lessonId')
  async rejectLesson(@Param('lessonId') lessonId: string) {
    return await this.adminsService.rejectLesson(lessonId);
  }

  @UseInterceptors(ClearCacheCourseLessonsInterceptor)
  @Patch('accepte-lesson/:lessonId')
  async accepteLesson(
    @Param('lessonId') lessonId: string,
    @Req() req: FastifyRequest,
  ) {
    return await this.adminsService.accepteLesson(lessonId, req);
  }

  @Get('courses-reports')
  async getCoursesReports(
    @Query() query: GetCoursesReportsDto,
    @Req() req: FastifyRequest,
  ) {
    return await this.adminsService.getCoursesReports(query, req);
  }

  @Delete('delete-correction-course-of-courses-reports/:reportId')
  async deleteCorrectionCourseReport(@Param('reportId') reportId: string) {
    return await this.adminsService.deleteCorrectionCourseReport(reportId);
  }

  @Patch('accepte-correction-course-of-courses-reports/:reportId')
  async accepteCorrectionCourseReport(@Param('reportId') reportId: string) {
    return await this.adminsService.accepteCorrectionCourseReport(reportId);
  }

  @Get('wallet')
  async getWallet(@Req() req: FastifyRequest) {
    return await this.adminsService.getWallet(req);
  }

  @Post('request-funs')
  async adminRequestFuns(
    @Req() req: FastifyRequest,
    @Body() RequestFunsDto: RequestFunsDto,
  ) {
    return await this.adminsService.RequestFuns(req, RequestFunsDto);
  }
}
