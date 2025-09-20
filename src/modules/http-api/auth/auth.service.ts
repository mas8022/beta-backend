import { PhoneDto } from './dto/phone.dto';
import { Injectable } from '@nestjs/common';
import { VerifyOtpCodeDto } from './dto/verify-otp-code.dto';
import { randomUUID } from 'crypto';
import { parse } from 'cookie';
import { PrismaService } from 'src/common/services/prisma/prisma.service';
import { RedisService } from 'src/common/services/redis/redis.service';
import { JwtService } from 'src/common/services/jwt/jwt.service';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
  ) {}

  async sendOtp({ phone }: PhoneDto) {
    try {
      const code = Math.floor(10000 + Math.random() * 90000).toString();

      await axios.post(
        'http://ippanel.com/api/select',
        {
          op: 'pattern',
          user: process.env.FARAZSMS_USER,
          pass: process.env.FARAZSMS_PASS,
          fromNum: process.env.FARAZSMS_FROM_NUM,
          toNum: phone,
          patternCode: process.env.FARAZSMS_PATTERN_CODE,
          inputData: [{ 'verification-code': code }],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      await this.redisService.set(`otp:${phone}`, code, 120);

      return { status: 200, message: 'کد ارسال شد' };
    } catch (error) {
      return { status: 500, message: 'خطا در ارسال کد' };
    }
  }

  async verifyOtp({ code, phone }: VerifyOtpCodeDto) {
    const savedCode = await this.redisService.get(`otp:${phone}`);

    if (!savedCode) {
      return { message: 'کد تأیید منقضی شده یا پیدا نشد', status: 403 };
    }

    if (savedCode !== code) {
      return { message: 'کد تأیید نامعتبر است', status: 401 };
    }

    await this.redisService.del(`otp:${phone}`);

    let user = await this.prismaService.user.findUnique({
      where: { phone },
    });

    if (!user) {
      const count = await this.prismaService.user.count();

      user = await this.prismaService.user.create({
        data: {
          phone,
          roles: count === 0 ? ['MANAGER', 'USER'] : ['USER'],
        },
      });
    }

    const sessionId = randomUUID();

    const refreshToken = this.jwtService.signRefreshToken({
      id: user.id,
      role: user.roles,
      sessionId,
    });

    const accessToken = this.jwtService.signAccessToken({
      id: user.id,
      role: user.roles,
    });

    await this.redisService.set(
      `refresh_token:${sessionId}`,
      refreshToken,
      7 * 24 * 60 * 60,
    );

    return {
      message: 'ورود با موفقیت انجام شد',
      status: 200,
      accessToken,
      sessionId,
    };
  }

  async refreshToken(cookies) {
    try {
      const { access_token, session_id } = cookies;
      try {
        this.jwtService.verifyAccessToken(access_token);
        return { status: 200, message: 'توکن معتبر است' };
      } catch {}

      if (!session_id) {
        return { status: 403, message: 'لطفاً وارد حساب شوید' };
      }

      const rawRefresh = await this.redisService.get(
        `refresh_token:${session_id}`,
      );

      if (!rawRefresh) {
        return { status: 403, message: 'لطفاً وارد حساب شوید' };
      }

      try {
        const refreshPayload = this.jwtService.verifyRefreshToken(rawRefresh);

        const newAccessToken = this.jwtService.signAccessToken({
          id: refreshPayload.id,
          role: refreshPayload.role,
        });

        return {
          status: 200,
          message: 'توکن جدید با موفقیت ایجاد شد',
          newAccessToken,
        };
      } catch {
        return {
          status: 403,
          message: 'توکن نامعتبر است. لطفاً دوباره وارد شوید',
        };
      }
    } catch (error) {
      return {
        status: 500,
        message: 'اینترنت خود را بررسی کنید',
      };
    }
  }

  async logout(rawCookies: string) {
    const { session_id } = parse(rawCookies || '');

    if (!session_id) {
      return { status: 400, message: 'شناسه نشست پیدا نشد' };
    }

    await this.redisService.del(`refresh_token:${session_id}`);

    return { status: 200, message: 'با موفقیت خارج شدید' };
  }
}
