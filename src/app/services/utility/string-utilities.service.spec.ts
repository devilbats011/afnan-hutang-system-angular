import { TestBed } from '@angular/core/testing';

import { StringUtilitiesService } from './string-utilities.service';

describe('StringUtilitiesService', () => {
  let service: StringUtilitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StringUtilitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
