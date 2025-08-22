import {
  Body,
  Controller,
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

  // @Post()
  // createManyCourses() {
  //   return this.coursesService.createManyCourses();
  // }

  @Post('create-test-course')
  async createTestCourse() {
    return this.coursesService.createTestCourse();
  }

  @Get()
  findFilteredCourses(
    @Query() query: GetCoursesSearchParamsDto,
    @Headers('cookie') rawCookies: string,
  ) {
    return this.coursesService.findFilteredCourses(query, rawCookies);
  }

  @Patch('like-toggle')
  async toggleLike(
    @Body() { courseId }: { courseId: string },
    @Headers('cookie') rawCookies: string,
  ) {
    return this.coursesService.toggleLike(courseId, rawCookies);
  }

  @Get(':id')
  async getCourse(
    @Param('id') id: string,
    @Headers('cookie') rawCookie: string,
  ) {
    return await this.coursesService.getCourse(id, rawCookie);
  }

  @Get('find-courses-by-searchbar')
  async findCoursesBySearchBar(@Query('search') search: string) {
    return this.coursesService.findCoursesBySearchBar(search);
  }

  @UseGuards(UserGuard)
  @Post('create-course-comment/:courseId')
  async createCourseComment(
    @Param('courseId') courseId: string,
    @Body('text') text: string,
    @Req() req: FastifyRequest,
  ) {
    return this.coursesService.createCourseComment(courseId, text, req);
  }
}
