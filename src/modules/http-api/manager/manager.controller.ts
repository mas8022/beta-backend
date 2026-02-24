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
  UseInterceptors,
} from '@nestjs/common';
import { ManagerService } from './manager.service';
import type { FastifyRequest } from 'fastify';
import {
  FileFieldsInterceptor,
  UploadedFiles,
} from '@blazity/nest-file-fastify';
import { GetRequestsCollaborateDto } from './dto/get-request-collaborate.dto';
import { SetAuthorPermissionParamDto } from './dto/set-author-permission-param.dto';
import { SetAuthorPermissionBodyDto } from './dto/set-author-permission-body.dto';
import { GetContactUsMessageDto } from './dto/get-contact-us-message.dto';
import { GetRequestsFunsDto } from './dto/get-requests-funs.dto';
import { JsonSerializerInterceptor } from 'src/common/interceptors/json-serializer.interceptor';
import { GetCoursesDto } from './dto/get-courses.dto';
import { GetCoursesReportsDto } from './dto/get-courses-reports.dto';
import { RequestFunsDto } from './dto/request-funs.dto';
import { ClearCacheInterceptor } from 'src/common/interceptors/clear-cache.interceptor';
import { GetAdminsConfirmsDto } from './dto/get-admins-confirms.dto';
import { RejectEntityDto } from './dto/reject-entity.dto';
import { ClearCacheCourseLessonsInterceptor } from 'src/common/interceptors/clear-cache-course-lessons.interceptor';
import { createCourseCategoryDto } from './dto/create-course-category.dto';
import { EditCourseCategoryDto } from './dto/edit-course-category';
import { Auth } from 'src/common/decorators/auth.decorator';
import { GetUsersDto } from './dto/get-users.dto';

@Auth('MANAGER')
@Controller('manager')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @Auth('MANAGER', 'SUPERVISOR')
  @Get('find-users')
  async findUser(@Query() query: GetUsersDto) {
    return await this.managerService.findUser(query);
  }

  @Auth('MANAGER', 'SUPERVISOR')
  @Get('contact-us-comments')
  async getContactUsComments(@Query() query: GetContactUsMessageDto) {
    return await this.managerService.getContactUsComments(query);
  }

  @Auth('MANAGER', 'SUPERVISOR')
  @Delete('contact-us-comment/:commentId')
  async deleteContactUsComment(@Param('commentId') commentId: string) {
    return await this.managerService.deleteContactUsComment(commentId);
  }

  @Auth('MANAGER', 'SUPERVISOR')
  @Get('profile')
  async getManagerProfile(@Req() req: FastifyRequest) {
    return await this.managerService.getManagerProfile(req);
  }

  @Auth('MANAGER', 'SUPERVISOR')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'avatar', maxCount: 1 }]))
  @Put('edit-profile')
  async editProfile(
    @UploadedFiles() files: any,
    @Body() body: any,
    @Req() req: FastifyRequest,
  ) {
    return this.managerService.editProfile(files, body, req);
  }

  @Auth('MANAGER', 'SUPERVISOR')
  @Get('requests-collaborate')
  async getRequestsCollaborate(@Query() query: GetRequestsCollaborateDto) {
    return await this.managerService.getRequestsCollaborate(query);
  }

  @Auth('MANAGER', 'SUPERVISOR')
  @Patch('set-collaborate-permisson/:requestId/:status')
  async setCollaboratePermisson(
    @Param() params: SetAuthorPermissionParamDto,
    @Body() request: SetAuthorPermissionBodyDto,
  ) {
    return await this.managerService.setCollaboratePermisson(params, request);
  }

  @Auth('MANAGER', 'SUPERVISOR')
  @Delete('request-collaborate/:requestId')
  async deleteRequestCollaborate(@Param('requestId') requestId: string) {
    return await this.managerService.deleteRequestCollaborate(requestId);
  }

  @Get('requests-funs')
  @UseInterceptors(JsonSerializerInterceptor)
  async getRequestsFuns(@Query() query: GetRequestsFunsDto) {
    return await this.managerService.getRequestsFuns(query);
  }

  @Patch('accept-author-request-funs/:requestId')
  async accepteAuthorRequestFuns(@Param('requestId') requestId: string) {
    return await this.managerService.accepteAuthorRequestFuns(requestId);
  }

  @Patch('reject-author-request-funs/:requestId')
  async rejectAuthorRequestFuns(@Param('requestId') requestId: string) {
    return await this.managerService.rejectAuthorRequestFuns(requestId);
  }

  @UseInterceptors(JsonSerializerInterceptor)
  @Get('financials-overview')
  async getFinancialsOverView(@Req() req: FastifyRequest) {
    return await this.managerService.getFinancialsOverView(req);
  }

  @Auth('MANAGER', 'SUPERVISOR')
  @Get('courses')
  async getCourses(@Query() query: GetCoursesDto) {
    return await this.managerService.getCourses(query);
  }

  @Auth('MANAGER', 'SUPERVISOR')
  @Get('over-view-course/:courseId')
  async getOverViewCourse(@Param('courseId') courseId: string) {
    return this.managerService.getOverViewCourse(courseId);
  }

  @Auth('MANAGER', 'SUPERVISOR')
  @Get('course-lessons/:courseId')
  async getCourseLessons(@Param('courseId') courseId: string) {
    return this.managerService.getCourseLessons(courseId);
  }

  @Auth('MANAGER', 'SUPERVISOR')
  @UseInterceptors(ClearCacheInterceptor('cache:courses:*'))
  @Patch('reject-course/:courseId')
  async rejectCourse(@Param('courseId') courseId: string) {
    return await this.managerService.rejectCourse(courseId);
  }

  @Auth('MANAGER', 'SUPERVISOR')
  @UseInterceptors(ClearCacheInterceptor('cache:courses:*'))
  @Patch('accepte-course/:courseId')
  async accepteCourse(
    @Param('courseId') courseId: string,
    @Req() req: FastifyRequest,
  ) {
    return await this.managerService.accepteCourse(courseId, req);
  }

  @Auth('MANAGER', 'SUPERVISOR')
  @UseInterceptors(ClearCacheCourseLessonsInterceptor)
  @Patch('reject-lesson/:lessonId')
  async rejectLesson(@Param('lessonId') lessonId: string) {
    return await this.managerService.rejectLesson(lessonId);
  }

  @Auth('MANAGER', 'SUPERVISOR')
  @UseInterceptors(ClearCacheCourseLessonsInterceptor)
  @Patch('accepte-lesson/:lessonId')
  async accepteLesson(
    @Param('lessonId') lessonId: string,
    @Req() req: FastifyRequest,
  ) {
    return await this.managerService.accepteLesson(lessonId, req);
  }

  @Auth('MANAGER', 'SUPERVISOR')
  @UseInterceptors(ClearCacheCourseLessonsInterceptor)
  @Patch('accepte-episode/:episodeId')
  async accepteEpisode(
    @Param('episodeId') id: string,
    @Req() req: FastifyRequest,
  ) {
    return await this.managerService.accepteEpisode(id, req);
  }

  @Auth('MANAGER', 'SUPERVISOR')
  @UseInterceptors(ClearCacheCourseLessonsInterceptor)
  @Patch('reject-episode/:episodeId')
  async rejectEpisode(@Param('episodeId') id: string) {
    return await this.managerService.rejectEpisode(id);
  }

  @Auth('MANAGER', 'SUPERVISOR')
  @Post('send-course-report/:courseId')
  async sendCourseReport(
    @Param('courseId') courseId: string,
    @Body('message') message: string,
    @Req() req: FastifyRequest,
  ) {
    return await this.managerService.sendCourseReport(courseId, message, req);
  }

  @Auth('MANAGER', 'SUPERVISOR')
  @Get('courses-reports')
  async getCoursesReports(
    @Query() query: GetCoursesReportsDto,
    @Req() req: FastifyRequest,
  ) {
    return await this.managerService.getCoursesReports(query, req);
  }

  @Auth('MANAGER', 'SUPERVISOR')
  @Patch('accepte-correction-course-of-courses-reports/:reportId')
  async accepteCorrectionCourseReport(@Param('reportId') reportId: string) {
    return await this.managerService.accepteCorrectionCourseReport(reportId);
  }

  @Auth('MANAGER', 'SUPERVISOR')
  @Delete('delete-correction-course-of-courses-reports/:reportId')
  async deleteCorrectionCourseReport(@Param('reportId') reportId: string) {
    return await this.managerService.deleteCorrectionCourseReport(reportId);
  }

  @Patch('edit-roles/:userId')
  async editRoles(@Body('roles') roles: any, @Param('userId') userId: string) {
    return await this.managerService.editRoles(roles, userId);
  }

  @Post('request-funs')
  async authorRequestFuns(
    @Req() req: FastifyRequest,
    @Body() RequestFunsDto: RequestFunsDto,
  ) {
    return await this.managerService.RequestFuns(req, RequestFunsDto);
  }

  @Auth('MANAGER', 'SUPERVISOR')
  @Get('monitor-admins')
  async getMonitorAdmins(@Query() query: any) {
    return await this.managerService.getMonitorAdmins(query);
  }

  @Auth('MANAGER', 'SUPERVISOR')
  @Delete('course-report/:id')
  async deleteAcceptedCourseReport(@Param('id') id: string) {
    return await this.managerService.deleteAcceptedCourseReport(id);
  }

  @Auth('MANAGER', 'SUPERVISOR')
  @Patch('block-admin/:id')
  async blockAdmin(@Param('id') id: string) {
    return await this.managerService.blockAdmin(id);
  }

  @Auth('MANAGER', 'SUPERVISOR')
  @Get('admins-confirms')
  async getAdminsConfirms(@Query() query: GetAdminsConfirmsDto) {
    return await this.managerService.getAdminsConfirms(query);
  }

  @Auth('MANAGER', 'SUPERVISOR')
  @UseInterceptors(ClearCacheInterceptor('cache:courses:get-course-lessons-*'))
  @Patch('reject-entity')
  async rejectEntity(@Query() query: RejectEntityDto) {
    return await this.managerService.rejectEntity(query);
  }

  @Auth('MANAGER', 'SUPERVISOR')
  @Delete('admin-confirm/:id')
  async deleteAdminConfirm(@Param('id') id: string) {
    return await this.managerService.deleteAdminConfirm(id);
  }

  @Post('create-course-category')
  async createCourseCategory(@Body() body: createCourseCategoryDto) {
    return await this.managerService.createCourseCategory(body);
  }

  @Patch('edit-course-category')
  async editCourseCategory(@Body() body: EditCourseCategoryDto) {
    return await this.managerService.editCourseCategory(body);
  }
}
