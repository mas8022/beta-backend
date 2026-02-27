import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Throttle } from '@nestjs/throttler';
import { Auth } from 'src/common/decorators/auth.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('me')
  async getMe(@Headers('cookie') rawCookies: string) {
    const result = await this.userService.getMe(rawCookies);

    return { status: 403, data: result };
  }

  @Auth('USER')
  @Get('get-my-profile-data')
  async GetMyProfileData(@Req() req: FastifyRequest) {
    return this.userService.GetMyProfileData(req);
  }

  @Throttle({ default: { limit: 3, ttl: 60 } })
  @Auth('USER')
  @Post('request-user-payment/:id')
  async paymentRequest(
    @Param('id') id: string,
    @Req() req: FastifyRequest,
    @Body('promotionCode') promotionCode: string,
  ) {
    return await this.userService.paymentRequest(id, req, promotionCode);
  }

  @Throttle({ default: { limit: 3, ttl: 60 } })
  @Get('verify-user-payment')
  async verifyPayment(
    @Res() res: FastifyReply,
    @Query('trackId') authority: string,
  ) {
    const result = await this.userService.verifyPayment(authority);

    res
      .status(302)
      .redirect(
        `${process.env.FRONTEND_URL}/payment-result?status=${String(result.status)}`,
      );
  }

  @Get('access-course/:courseId')
  async getAccessCourse(
    @Param('courseId') courseId: string,
    @Headers('cookie') rawCookies: string,
  ) {
    return await this.userService.getAccessCourse(courseId, rawCookies);
  }

  @Post('complete-episode/:episodeId')
  async completeEpisode(
    @Param('episodeId') episodeId: string,
    @Headers('cookie') rawCookies: string,
  ) {
    return await this.userService.completeEpisode(episodeId, rawCookies);
  }

  @Get('course-completion-percent/:courseId')
  async getCourseCompletionPercent(
    @Param('courseId') courseId: string,
    @Headers("cookie") rawCookies: string,
  ) {
    return await this.userService.getCourseCompletionPercent(
      courseId,
      rawCookies,
    );
  }
}
