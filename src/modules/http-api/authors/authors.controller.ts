import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthorGuard } from './author.guard';
import type { FastifyRequest } from 'fastify';
import {
  FileFieldsInterceptor,
  UploadedFiles,
} from '@blazity/nest-file-fastify';
import { EditCourseDto } from './dto/edit-course.dto';
import { EditLessonsAndEpisodesOrderDto } from './dto/edit-lessons-and-episodes-order.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { EditLessonDto } from './dto/edit-lesson.dto';
import { EpisodeDto } from './dto/episode.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { GetCoursesReportsDto } from './dto/get-courses-reports.dto';
import { CreateCoursePromotionDto } from './dto/create-course-promotion.dto';
import { EditCoursePromotionDto } from './dto/edit-course-promotion.dto';
import { GetCoursesDto } from './dto/get-course.dto';

@UseGuards(AuthorGuard)
@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Get('profile')
  async getAuthorProfile(@Req() req: FastifyRequest) {
    return await this.authorsService.getAuthorProfile(req);
  }

  @UseInterceptors(FileFieldsInterceptor([{ name: 'avatar', maxCount: 1 }]))
  @Put('edit-profile')
  async editProfile(
    @UploadedFiles() files: any,
    @Body() body: any,
    @Req() req: FastifyRequest,
  ) {
    return this.authorsService.editProfile(files, body, req);
  }

  @Get('author-comments')
  async getAuthorComments(@Req() req: FastifyRequest) {
    return await this.authorsService.getAuthorComments(req);
  }

  @Patch('confirm-comment/:commentId')
  async confirmComment(@Param('commentId') commentId: string) {
    return await this.authorsService.confirmComment(commentId);
  }

  @Patch('reject-comment/:commentId')
  async rejectComment(@Param('commentId') commentId: string) {
    return await this.authorsService.rejectComment(commentId);
  }
  @Patch('reply-comment/:commentId')
  async replyComment(
    @Param('commentId') commentId: string,
    @Body('replyText') replyText: string,
  ) {
    return await this.authorsService.replyComment(commentId, replyText);
  }

  @Get('author-courses')
  async getAuthorCourses(
    @Req() req: FastifyRequest,
    @Query() query: GetCoursesDto,
  ) {
    return await this.authorsService.getAuthorCourses(req, query);
  }

  @Post('create-course')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  async createCourse(
    @UploadedFiles() files: any,
    @Body() createCourseDto: CreateCourseDto,
    @Req() req: FastifyRequest,
  ) {
    return await this.authorsService.createCourse(files, createCourseDto, req);
  }

  @Delete('delete-course/:courseId')
  async deleteCourse(@Param('courseId') courseId: string) {
    return await this.authorsService.deleteCourse(courseId);
  }

  @Get('over-view-course/:courseId')
  async getOverViewCourse(@Param('courseId') courseId: string) {
    return this.authorsService.getOverViewCourse(courseId);
  }

  @Put('edit-course/:courseId')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  async editCourse(
    @Param('courseId') courseId: string,
    @UploadedFiles() files: any,
    @Body() body: EditCourseDto,
  ) {
    return this.authorsService.editCourse(courseId, files, body);
  }

  @Get('course-lessons/:courseId')
  async getCourseLessons(@Param('courseId') courseId: string) {
    return this.authorsService.getCourseLessons(courseId);
  }

  @Put('edit-lessons-and-episodes-order')
  async editLessonsAndEpisodesOrders(
    @Body() lessons: EditLessonsAndEpisodesOrderDto[],
  ) {
    return await this.authorsService.editLessonsAndEpisodesOrder(lessons);
  }

  @Post('create-lesson/:courseId')
  async createLesson(
    @Param('courseId') courseId: string,
    @Body() body: CreateLessonDto,
  ) {
    return await this.authorsService.createLesson(courseId, body);
  }

  @Delete('delete-lesson/:lessonId')
  async deleteLesson(@Param('lessonId') lessonId: string) {
    return await this.authorsService.deleteLesson(lessonId);
  }

  @Put('edit-lesson/:lessonId')
  async editLesson(
    @Param('lessonId') lessonId: string,
    @Body() editLessonDto: EditLessonDto,
  ) {
    return await this.authorsService.editLesson(lessonId, editLessonDto);
  }

  @Post('create-episode/:lessonId')
  async createEpisode(
    @Param('lessonId') lessonId: string,
    @Body() body: EpisodeDto,
  ) {
    return await this.authorsService.createEpisode(lessonId, body);
  }

  @Delete('delete-episode/:episodeId')
  async deleteEpisode(@Param('episodeId') episodeId: string) {
    return await this.authorsService.deleteEpisode(episodeId);
  }

  @Put('edit-episode/:id')
  async editEpisode(@Param('id') id: string, @Body() body: EpisodeDto) {
    return await this.authorsService.editEpisode(id, body);
  }

  @Get('courses-reports')
  async getCoursesReports(
    @Query() query: GetCoursesReportsDto,
    @Req() req: FastifyRequest,
  ) {
    return await this.authorsService.getCoursesReports(query, req);
  }

  @Patch('correction-course-of-courses-reports/:reportId')
  async correctionCourseReport(@Param('reportId') reportId: string) {
    return await this.authorsService.correctionCourseReport(reportId);
  }

  @Patch('reject-correction-course-of-courses-reports/:reportId')
  async rejectCorrectionCourseReport(@Param('reportId') reportId: string) {
    return await this.authorsService.rejectCorrectionCourseReport(reportId);
  }

  @Delete('delete-correction-course-of-courses-reports/:reportId')
  async deleteCorrectionCourseReport(@Param('reportId') reportId: string) {
    return await this.authorsService.deleteCorrectionCourseReport(reportId);
  }

  @Post('create-course-promotion')
  async createCousrePromotion(
    @Body() body: CreateCoursePromotionDto,
    @Req() req: FastifyRequest,
  ) {
    return await this.authorsService.createCousrePromotion(body, req);
  }

  @Get('cousres-promotions')
  async getCoursesPromotions(
    @Query('search') search: string,
    @Req() req: FastifyRequest,
  ) {
    return await this.authorsService.getCoursesPromotions(search, req);
  }

  @Delete('cousre-promotion/:id')
  async deleteCoursePromotion(@Param('id') id: string) {
    return await this.authorsService.deleteCoursePromotion(id);
  }

  @Put('edit-cousre-promotion/:id')
  async editCousrePromotion(
    @Param('id') id: string,
    @Body() body: EditCoursePromotionDto,
  ) {
    return await this.authorsService.editCousrePromotion(id, body);
  }
}
