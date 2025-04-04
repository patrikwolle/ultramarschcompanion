import { TestBed } from '@angular/core/testing';

import { UmServiceService } from './um-service.service';

describe('UmServiceService', () => {
  let service: UmServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UmServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
