import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private errorMessages: Record<string, string> = {
    'Forbidden resource': 'دسترسی به این بخش مجاز نیست',
    Unauthorized: 'شما وارد نشده‌اید',
    'Validation failed': 'اطلاعات وارد شده صحیح نیست',
    'Bad Request': 'درخواست شما صحیح نیست',
    'Not Found': 'موردی پیدا نشد',
    'Internal Server Error': 'خطای سرور رخ داده است',
  };

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    let rawMessage: any = 'خطای ناشناخته';

    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      if (typeof res === 'string') {
        rawMessage = res;
      } else if (typeof res === 'object' && (res as any).message) {
        rawMessage = (res as any).message;
      }
    } else if (exception?.message) {
      rawMessage = exception.message;
    }

    // اگر پیام آرایه‌ای بود
    if (Array.isArray(rawMessage)) {
      rawMessage = rawMessage.join('، ');
    }

    // ترجمه پیام اگر کلید مشابه پیدا شد
    const translatedKey = Object.keys(this.errorMessages).find((key) =>
      rawMessage.includes(key),
    );
    const message = translatedKey
      ? this.errorMessages[translatedKey]
      : rawMessage;

    // پاسخ نهایی
    response.status(status).send({
      status,
      message,
      path: request.url,
    });
  }
}
