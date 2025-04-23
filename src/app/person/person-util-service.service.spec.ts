import { TestBed } from '@angular/core/testing';

import { PersonUtilServiceService } from './person-util-service.service';

describe('PersonUtilServiceService', () => {
  let service: PersonUtilServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonUtilServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
