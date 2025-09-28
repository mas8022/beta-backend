import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { GetCoursesSearchParamsDto } from './dto/get-Courses-search-params.dto';
import { UserGuard } from '../users/user.Guard';
import type { FastifyRequest } from 'fastify';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post('create-test-course')
  async createTestCourse() {
    return this.coursesService.createTestCourse();
  }

  @Get()
  findFiltered(
    @Query() query: GetCoursesSearchParamsDto,
    @Headers('cookie') rawCookies: string,
  ) {
    return this.coursesService.findFiltered(query, rawCookies);
  }

  @Patch('toggle-like')
  async toggleLike(
    @Body() { courseId }: { courseId: string },
    @Headers('cookie') rawCookies: string,
  ) {
    return this.coursesService.toggleLike(courseId, rawCookies);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return await this.coursesService.getOne(id);
  }

  @Get('find-courses-by-searchbar')
  async findBySearchBar(@Query('search') search: string) {
    return this.coursesService.findBySearchBar(search);
  }

  @UseGuards(UserGuard)
  @Post('create-course-comment/:courseId')
  async createComment(
    @Param('courseId') courseId: string,
    @Body('text') text: string,
    @Req() req: FastifyRequest,
  ) {
    return this.coursesService.createComment(courseId, text, req);
  }

  @Delete('delete-course-comment/:commentId')
  async deleteComment(@Param('commentId') commentId: string) {
    return this.coursesService.deleteComment(commentId);
  }

  @Get('get-lessons/:courseId')
  async getLessons(
    @Param('courseId') courseId: string,
    @Headers('cookie') rawCookies: string,
  ) {
    return this.coursesService.getLessons(courseId, rawCookies);
  }
}
