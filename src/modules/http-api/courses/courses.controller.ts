import { Body, Controller, Get, Headers, Patch, Post, Query } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { GetCoursesSearchParamsDto } from './dto/get-Courses-search-params.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  createManyCourses() {
    return this.coursesService.createManyCourses();
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
}
