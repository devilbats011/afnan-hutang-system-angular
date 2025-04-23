import { TestBed } from '@angular/core/testing';

import { CalendarUtilService } from './calendar-util.service';

describe('CalendarUtilService', () => {
  let service: CalendarUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalendarUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
