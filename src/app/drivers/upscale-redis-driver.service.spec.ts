import { TestBed } from '@angular/core/testing';

import { UpscaleRedisDriverService } from './upscale-redis-driver.service';

describe('UpscaleRedisDriverService', () => {
  let service: UpscaleRedisDriverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpscaleRedisDriverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
