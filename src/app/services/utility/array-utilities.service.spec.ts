import { TestBed } from '@angular/core/testing';

import { ArrayUtilitiesService } from './array-utilities.service';

describe('ArrayUtilitiesService', () => {
  let service: ArrayUtilitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArrayUtilitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
