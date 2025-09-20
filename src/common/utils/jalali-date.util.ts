import * as jalaali from 'jalaali-js';

export class JalaliDateUtil {
  private static readonly persianMonths = [
    'فروردین',
    'اردیبهشت',
    'خرداد',
    'تیر',
    'مرداد',
    'شهریور',
    'مهر',
    'آبان',
    'آذر',
    'دی',
    'بهمن',
    'اسفند',
  ];

  static toJalaliMonth(date: Date) {
    const g = {
      gy: date.getFullYear(),
      gm: date.getMonth() + 1,
      gd: date.getDate(),
    };

    const { jy, jm } = jalaali.toJalaali(g.gy, g.gm, g.gd);

    return {
      year: jy,
      monthIndex: jm - 1,
      monthName: this.persianMonths[jm - 1],
    };
  }
}
