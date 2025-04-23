import { TestBed } from '@angular/core/testing';

import { JsonServerDriverService } from './json-server-driver.service';

describe('JsonServerDriverService', () => {
  let service: JsonServerDriverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsonServerDriverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
