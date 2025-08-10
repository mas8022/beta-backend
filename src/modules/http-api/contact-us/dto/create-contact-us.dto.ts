import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MinLength,
  ValidateIf,
  Matches,
} from 'class-validator';
import { TopicEnum } from '@prisma/client';

export class CreateContactUsDto {
  @IsNotEmpty({ message: 'نام باید وارد شود.' })
  @MinLength(2, { message: 'نام باید حداقل ۲ کاراکتر باشد.' })
  name: string;

  @IsNotEmpty({ message: 'ایمیل باید وارد شود.' })
  @IsEmail({}, { message: 'ایمیل معتبر نیست.' })
  email: string;

  @IsOptional()
  @Matches(/^[0-9+\-\s()]{7,}$/, { message: 'شماره تماس معتبر نیست.' })
  phone?: string;

  @IsEnum(TopicEnum, { message: 'موضوع را انتخاب کنید.' })
  topic: TopicEnum;

  @IsNotEmpty({ message: 'پیام باید وارد شود.' })
  @MinLength(10, { message: 'پیام باید حداقل ۱۰ کاراکتر باشد.' })
  message: string;

  @IsBoolean({ message: 'مقدار صحیح برای موافقت لازم است.' })
  @ValidateIf((obj) => obj.consent === true)
  consent: boolean;
}
