import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

@Injectable()
export class SafeValidationPipe implements PipeTransform {
  constructor(private readonly options?: { skipMethods?: string[] }) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const requestMethod =
      (metadata as any)?.metatype?.prototype?.constructor?.name || '';

    // 🚀 فقط برای متدهای خاص (برای performance بهتر)
    const skip = this.options?.skipMethods?.includes(requestMethod);
    if (skip || !metadata.metatype || this.isPrimitive(metadata.metatype)) {
      return value;
    }

    // 🧩 تبدیل و اعتبارسنجی کلاس
    const object = plainToInstance(metadata.metatype, value);
    const errors = validateSync(object, {
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    });

    if (errors.length > 0) {
      const messages = errors
        .map((e) => (e.constraints ? Object.values(e.constraints) : []))
        .flat();

      throw new BadRequestException(messages);
    }

    // 🧼 تمیزسازی کل داده از XSS و SQL Injection
    return this.deepSanitize(object);
  }

  private isPrimitive(type: any): boolean {
    const primitives = [String, Boolean, Number, Array, Object];
    return primitives.includes(type);
  }

  private deepSanitize(obj: any): any {
    if (obj === null || obj === undefined) return obj;

    if (typeof obj === 'string') {
      return obj
        .replace(/[<>]/g, '') // حذف تگ‌های HTML/XSS
        .replace(/(['"`;])/g, '') // حذف کاراکترهای SQL
        .trim();
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.deepSanitize(item));
    }

    if (typeof obj === 'object') {
      const cleanObj = {};
      for (const key of Object.keys(obj)) {
        cleanObj[key] = this.deepSanitize(obj[key]);
      }
      return cleanObj;
    }

    return obj;
  }
}
