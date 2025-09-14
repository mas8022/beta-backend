import { IsString, Matches } from 'class-validator';

export class FindUserParamDto {
  @IsString()
  @Matches(/^09\d{9}$/, { message: 'شماره موبایل باید با 09 شروع شود و 11 رقم باشد' })
  phone: string;
}
