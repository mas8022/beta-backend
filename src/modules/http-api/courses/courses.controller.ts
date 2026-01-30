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
  UseInterceptors,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { GetCoursesSearchParamsDto } from './dto/get-Courses-search-params.dto';
import type { FastifyRequest } from 'fastify';
import { CacheFindFilteredCoursesInterceptor } from './interceptors/find-filtered-courses-cache.interceptor';
import { Auth } from 'src/common/decorators/auth.decorator';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Auth('MANAGER')
  @Post('add-test-courses')
  async addTestCourses() {
    return this.coursesService.addTestCourses();
  }

  @UseInterceptors(CacheFindFilteredCoursesInterceptor)
  @Get()
  findFiltered(@Query() query: GetCoursesSearchParamsDto) {
    return this.coursesService.findFiltered(query);
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

  @Get('/course/like-btn-data/:courseId')
  async getCourseLikeBtn(
    @Param('courseId') courseId: string,
    @Headers('cookie') rawCookies: string,
  ) {
    return await this.coursesService.getCourseLikeBtn(courseId, rawCookies);
  }

  @Get('find-courses-by-searchbar')
  async findBySearchBar(@Query('search') search: string) {
    return this.coursesService.findBySearchBar(search);
  }

  @Auth('USER')
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

  @Get('author-publish-courses/:authorId')
  async getAuthorPublishCourses(@Param('authorId') authorId: string) {
    return await this.coursesService.getAuthorPublishCourses(authorId);
  }

  @Get('sitemap')
  async getSiteMap() {
    return await this.coursesService.getSiteMap();
  }

  @Get('comments/:courseId')
  async getComments(@Param('courseId') courseId: string, @Query() query: any) {
    return await this.coursesService.getComments(courseId, query);
  }

  @Get('categories')
  async getCategories() {
    return await this.coursesService.getCategories();
  }
}
