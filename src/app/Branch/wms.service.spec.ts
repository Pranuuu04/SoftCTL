import { TestBed } from '@angular/core/testing';

import { WMSService } from './wms.service';

describe('WMSService', () => {
  let service: WMSService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WMSService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
