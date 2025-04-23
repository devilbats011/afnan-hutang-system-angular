import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HutangForm, HutangFormExtends, jsonDate } from '../interfaces/hutang-form';
import { StateManagementService } from '../services/state-management.service';
import { ArrayUtilitiesService } from '../services/utility/array-utilities.service';
import { day } from '../interfaces/calendar';
import { RestApiService } from '../services/rest-api.service';
import { ViewHutangComponent } from "../view-hutang/view-hutang.component";
import { CalendarUtilService } from '../calendar-utilities/calendar-util.service';
import { EditHutangComponent } from "../edit-hutang/edit-hutang.component";
import { PersonUtilServiceService } from '../person/person-util-service.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-calendar',
  imports: [CommonModule, ViewHutangComponent, EditHutangComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {

  stateManagementService = inject(StateManagementService);
  arrayUtilitiesService = inject(ArrayUtilitiesService);
  restApiService = inject(RestApiService);
  calendarUtilService = inject(CalendarUtilService);
  personUtilServiceService = inject(PersonUtilServiceService);
  toaster = inject(ToastrService);



  protected days: day[] = [];

  protected monthYear: string = "-";
  protected currentDate = new Date();

  isHutangExist = signal(false);
  hutangArray = signal<HutangForm[]>([]);
  public showHutangsWhenClickDay = signal<HutangFormExtends[]>([]);

  ngOnInit() {
    (async () => {
      const hutangArray = await this.restApiService.getDBDriver()?.getAllHutang();
      if (!this.arrayUtilitiesService.validateBasicArray(hutangArray)) {
        this.hutangArray.set([]);
      } else {
        this.hutangArray.set(hutangArray as any);
      }
      // console.log('%csrc/app/calendar/calendar.component.ts:38 hutangArray', 'color: #007acc;', hutangArray);
      this.renderCalendar();
    })();
  }

  dayHandler(jsonDate: jsonDate) {
    if (!jsonDate.day || !jsonDate.month || !jsonDate.year) {
      return [];
    }

    const arrayOfHutang = this.calendarUtilService.getArrayOfHutangByJSONDate(jsonDate, this.hutangArray());
    if (this.arrayUtilitiesService.validateBasicArray(arrayOfHutang)) {
      return arrayOfHutang;
    }

    return [];
  }

  renderCalendar() {
    this.days = [];
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth() + 1;
    const timezoneOffsetMinutes = new Date().getTimezoneOffset(); // e.g., -480 minutes... msia
    const timezoneOffsetHours = -timezoneOffsetMinutes / 60; // e.g., 8 hours... msia
    this.monthYear = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(this.currentDate);

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    // empty days shown in the calendar
    for (let i = 0; i < firstDay; i++) {
      this.days.push({
        day: '',
        arrayOfHutang: [],
        eventDetail: {
          color: 'transparent',
        }
      });
    }

    for (let day = 1; day <= totalDays; day++) {
      const arrayOfHutang = this.dayHandler({ year, month, day, timezone: timezoneOffsetHours });
      this.days.push({
        day,
        arrayOfHutang,
        eventDetail: {
          color: 'ForestGreen',
        }
      });

    }
  }

  changeMonth(direction: number) {
    this.currentDate.setMonth(this.currentDate.getMonth() + direction);
    this.renderCalendar();
  }

  changeYear(direction: number) {
    this.currentDate.setFullYear(this.currentDate.getFullYear() + direction);
    this.renderCalendar();
  }

  constructor(private router: Router) { }

  clickDaybackgroundColor = 'transparent';

  clickDay(dayJson: day) {

    if (this.arrayUtilitiesService.validateBasicArray(dayJson.arrayOfHutang)) {
      this.showHutangsWhenClickDay.set(dayJson.arrayOfHutang.map(hutang => ({ ...hutang, isEditOpen: false })));
      this.clickDaybackgroundColor = '#dee';
    } else {
      this.clickDaybackgroundColor = 'transparent';
      this.showHutangsWhenClickDay.set([]);
    }

  }

  async deleteHutang(hutang: HutangFormExtends) {
    if (!hutang.id) {
      this.toaster.error('Ops,something went wrong', 'Hutang Undefined')
      return;
    }
    if (confirm("Are you sure you want to delete this hutang?")) {
      const isDelete = await this.restApiService.getDBDriver()?.deleteHutang(hutang.id);
      if (isDelete) {
        this.hutangArray.update(hArray => hArray.filter(h => h.id !== hutang.id));
        this.toaster.success('', 'Hutang Deleted');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    }
  }

}
