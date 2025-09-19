import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ManagerService } from './manager.service';
import { FindUserParamDto } from './dto/find-user-param.dto';
import { ManagerGuard } from './manager.guard';
import type { FastifyRequest } from 'fastify';
import {
  FileFieldsInterceptor,
  UploadedFiles,
} from '@blazity/nest-file-fastify';
import { GetRequestsCollaborateDto } from './dto/get-request-collaborate.dto';
import { SetAuthorPermissionParamDto } from './dto/set-author-permission-param.dto';
import { SetAuthorPermissionBodyDto } from './dto/set-author-permission-body.dto';
import { GetContactUsMessageDto } from './dto/get-contact-us-message.dto';
import { GetAuthorsRequestsFunsDto } from './dto/get-authors-requests-funs.dto';
import { BigIntInterceptor } from 'src/common/interceptors/bigint.interceptor';

@UseGuards(ManagerGuard)
@Controller('manager')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @Get('find-users/:phone')
  async findUser(@Param() param: FindUserParamDto) {
    return await this.managerService.findUser(param);
  }

  @Patch('users/:userId')
  async blockToggle(@Param('userId') userId: string) {
    return await this.managerService.blockToggle(userId);
  }

  @Get('contact-us-comments/:roleFilter/:search')
  async getContactUsComments(@Param() params: GetContactUsMessageDto) {
    return await this.managerService.getContactUsComments(params);
  }

  @Delete('contact-us-comment/:commentId')
  async deleteContactUsComment(@Param('commentId') commentId: string) {
    return await this.managerService.deleteContactUsComment(commentId);
  }

  @Get('profile')
  async getManagerProfile(@Req() req: FastifyRequest) {
    return await this.managerService.getManagerProfile(req);
  }

  @UseInterceptors(FileFieldsInterceptor([{ name: 'avatar', maxCount: 1 }]))
  @Put('edit-profile')
  async editProfile(
    @UploadedFiles() files: any,
    @Body() body: any,
    @Req() req: FastifyRequest,
  ) {
    return this.managerService.editProfile(files, body, req);
  }

  @Get('requests-collaborate')
  async getRequestsCollaborate(@Query() query: GetRequestsCollaborateDto) {
    return await this.managerService.getRequestsCollaborate(query);
  }

  @Patch('set-author-permission/:requestId/:status')
  async setAuthorPermission(
    @Param() params: SetAuthorPermissionParamDto,
    @Body() request: SetAuthorPermissionBodyDto,
  ) {
    return await this.managerService.setAuthorPermission(params, request);
  }

  @Delete('request-collaborate/:requestId')
  async deleteRequestCollaborate(@Param('requestId') requestId: string) {
    return await this.managerService.deleteRequestCollaborate(requestId);
  }

  @Get('authors-requests-funs')
  @UseInterceptors(BigIntInterceptor)
  async getAuthorsRequestsFuns(@Query() query: GetAuthorsRequestsFunsDto) {
    return await this.managerService.getAuthorsRequestsFuns(query);
  }

  @Patch('author-request-funs/:requestId')
  async accepteAuthorRequestFuns(@Param('requestId') requestId: string) {
    return await this.managerService.accepteAuthorRequestFuns(requestId);
  }
}
