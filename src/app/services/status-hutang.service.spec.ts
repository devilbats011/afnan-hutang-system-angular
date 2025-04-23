import { TestBed } from '@angular/core/testing';

import { StatusHutangService } from './status-hutang.service';

describe('StatusHutangService', () => {
  let service: StatusHutangService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatusHutangService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
