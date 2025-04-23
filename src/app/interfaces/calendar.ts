import { HutangForm, jsonDate } from "./hutang-form"

export interface Calendar {
  days: day[],
}

export interface day {
  day: number | string,
  arrayOfHutang: HutangForm[],
  eventDetail: {
    color: string,
  }
}

