import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthorGuard } from './author.Guard';
import type { FastifyRequest } from 'fastify';

@UseGuards(AuthorGuard)
@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Get('profile')
  async getAuthorProfile(@Req() req: FastifyRequest) {
    return await this.authorsService.getAuthorProfile(req);
  }

  @Put('edit-profile')
  async editProfile(@Body() body: any, @Req() req: FastifyRequest) {
    return await this.authorsService.editProfile(req, body);
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
  async replyComment(@Param('commentId') commentId: string, @Body("replyText") replyText: string) {
    return await this.authorsService.replyComment(commentId, replyText);
  }
}
