import { Injectable } from '@angular/core';
import { HutangForm, jsonDate } from '../interfaces/hutang-form';
import { DateUtilService } from '../date-utilities/date-util.service';

@Injectable({
  providedIn: 'root'
})
export class CalendarUtilService {
  constructor(private dateUtilService: DateUtilService) {}

  jsonDateExtractedFromIsoDate(isoDate: string): jsonDate | undefined {
    const date = new Date(isoDate);
    if (!this.dateUtilService.isValidDate(date)) {
      console.error('Invalid ISO Date:', isoDate);
      return;
    }
    return {
      year: date.getUTCFullYear(),
      month: Number(String(date.getUTCMonth() + 1).padStart(2, '0')),
      day: Number(String(date.getUTCDate()).padStart(2, '0')),
      timezone: null, // timezone: date.getTimezoneOffset(),
    };
  }

  getArrayOfHutangByJSONDate({ year, month, day, timezone = null }: jsonDate, arrayOfHutang: Partial<HutangForm>[]): any[] {
    return arrayOfHutang.filter((hutang: Partial<HutangForm>) => {
      const isDate = (hutang.jsonDate && hutang.jsonDate.year == year && hutang.jsonDate.month == month && hutang.jsonDate.day == day); // && hutang.jsonDateCreatedBy.timezone == timezone
      return isDate;
    });
  }

}
