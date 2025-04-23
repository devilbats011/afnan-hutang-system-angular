import { TestBed } from '@angular/core/testing';

import { PeopleUtilService } from './people-util.service';

describe('PeopleUtilService', () => {
  let service: PeopleUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeopleUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
