import {
  Controller,
  Post,
  Param,
  UseGuards,
  Req,
  Get,
  Query,
  Res,
  Redirect,
} from '@nestjs/common';
import { FinancialsService } from './financials.service';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { UserGuard } from '../users/user.Guard';

@Controller('financials')
export class FinancialsController {
  constructor(private readonly financialsService: FinancialsService) {}

  @UseGuards(UserGuard)
  @Post('request-user-payment/:id')
  async paymentRequest(@Param('id') id: string, @Req() req: FastifyRequest) {
    return await this.financialsService.paymentRequest(id, req);
  }

  @Get('verify-user-payment')
  async verifyPayment(
    @Res() res: FastifyReply,
    @Query('trackId') authority: string,
  ) {
    const result = await this.financialsService.verifyPayment(authority);

    res
      .status(302)
      .redirect(
        `${process.env.FRONTEND_URL}/payment-result?status=${String(result.status)}`,
      );
  }
}
