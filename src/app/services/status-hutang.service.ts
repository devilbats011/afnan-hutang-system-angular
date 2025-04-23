import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatusHutangService {

  constructor() { }

  static STATUS_ACTIVE = 'active';
  static STATUS_PAID = 'paid';
  static STATUS_CANCELLED = 'cancelled';
  static STATUS_LIST = [
    StatusHutangService.STATUS_ACTIVE,
    StatusHutangService.STATUS_PAID,
    StatusHutangService.STATUS_CANCELLED
  ];

  static getStatusColor(status: string) {
    switch (status) {
      case StatusHutangService.STATUS_ACTIVE:
        return 'yellow';
      case StatusHutangService.STATUS_PAID:
        return 'green';
      case StatusHutangService.STATUS_CANCELLED:
        return 'red';
      default:
        return 'black';
    }
  }
}
