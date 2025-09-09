import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

export type PaymentResult = {
  success: boolean;
  authority?: string;
  paymentUrl?: string;
  error?: string;
};

export type VerifyResult = {
  success: boolean;
  error?: string;
};

export type WithdrawResult = {
  success: boolean;
  trackId?: string;
  message?: string;
  error?: string;
};

@Injectable()
export class ZibalService {
  async createPayment(amount: number, mobile?: string): Promise<PaymentResult> {
    try {
      const response = await fetch('https://gateway.zibal.ir/v1/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchant: process.env.ZIBAL_MERCHANTID,
          amount,
          callbackUrl: `${process.env.BACKEND_URL}/financials/verify-user-payment`,
          mobile,
        }),
      });

      const result: any = await response.json();

      if (result.result === 100) {
        return {
          success: true,
          authority: result.trackId,
          paymentUrl: `https://gateway.zibal.ir/start/${result.trackId}`,
        };
      }

      return { success: false, error: 'ایجاد پرداخت ناموفق بود.' };
    } catch (error) {
      throw new HttpException(
        'خطای سرور رخ داد.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verifyPayment(trackId: string): Promise<VerifyResult> {
    if (!trackId) {
      throw new HttpException('کد پیگیری الزامی است.', HttpStatus.BAD_REQUEST);
    }

    try {
      const response = await fetch('https://gateway.zibal.ir/v1/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchant: process.env.ZIBAL_MERCHANTID,
          trackId,
        }),
      });

      const result: any = await response.json();

      return result.result === 100
        ? { success: true }
        : { success: false, error: 'تایید پرداخت ناموفق بود.' };
    } catch {
      throw new HttpException(
        'خطای سرور رخ داد.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async withdraw(
    amount: number,
    cardNumber: string,
    description?: string,
  ): Promise<WithdrawResult> {
    try {
      
      const response:any = await fetch('https://gateway.zibal.ir/v1/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchant: process.env.ZIBAL_MERCHANTID,
          amount,
          cardNumber,
          description,
        }),
      });
      
      const result: any = await response.json();
      

      if (result.result === 100) {
        return {
          success: true,
          trackId: result.trackId,
          message: result.message,
        };
      }

      return {
        success: false,
        error: result.message || 'برداشت وجه ناموفق بود.',
      };
    } catch {
      throw new HttpException(
        'خطای سرور رخ داد.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
