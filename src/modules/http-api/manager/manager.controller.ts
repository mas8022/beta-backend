import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
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

  @Get('contact-us-comments')
  async getContactUsComments() {
    return await this.managerService.getContactUsComments();
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
}
