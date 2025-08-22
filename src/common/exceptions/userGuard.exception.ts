import { HttpException, HttpStatus } from '@nestjs/common';

export class UserGuardException extends HttpException {
  constructor() {
    super(
      { status: 403, message: 'اول در سایت ثبت نام کنید' },
      HttpStatus.FORBIDDEN,
    );
  }
}
