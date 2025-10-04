import {
  Controller,
  Post,
  Param,
  UseGuards,
  Req,
  Get,
  Query,
  Res,
  Body,
} from '@nestjs/common';
import { FinancialsService } from './financials.service';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { UserGuard } from '../users/user.Guard';
import { AuthorGuard } from '../authors/author.guard';

@Controller('financials')
export class FinancialsController {
  constructor(private readonly financialsService: FinancialsService) {}

  @UseGuards(UserGuard)
  @Post('request-user-payment/:id')
  async paymentRequest(
    @Param('id') id: string,
    @Req() req: FastifyRequest,
    @Body('promotionCode') promotionCode: string,
  ) {
    return await this.financialsService.paymentRequest(id, req, promotionCode);
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

  @UseGuards(AuthorGuard)
  @Get('author-wallet')
  async getAuthorWallet(@Req() req: FastifyRequest) {
    return await this.financialsService.getAuthorWallet(req);
  }
}
