import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthorGuard } from './author.Guard';
import type { FastifyRequest } from 'fastify';
import {
  FileFieldsInterceptor,
  UploadedFiles,
} from '@blazity/nest-file-fastify';

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
}
