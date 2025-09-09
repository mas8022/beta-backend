import {
  IsNotEmpty,
  IsNumber,
  Min,
  IsString,
  Matches,
  Length,
} from 'class-validator';

export class AuthorRequestFunsDto {
  @IsNotEmpty({ message: 'مبلغ الزامی است' })
  @IsNumber({}, { message: 'مبلغ باید عدد باشد' })
  @Min(50_0000, { message: 'حداقل مبلغ 50,000 تومان است' })
  amount: number;

  @IsNotEmpty({ message: 'شماره کارت الزامی است' })
  @IsString({ message: 'شماره کارت باید رشته باشد' })
  @Matches(/^\d+$/, { message: 'شماره کارت باید فقط شامل اعداد باشد' })
  @Length(16, 16, { message: 'شماره کارت باید 16 رقمی باشد' })
  cardNumber: string;
}
