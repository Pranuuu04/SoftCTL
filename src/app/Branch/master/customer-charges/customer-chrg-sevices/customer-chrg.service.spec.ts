import { TestBed } from '@angular/core/testing';

import { CustomerChrgService } from './customer-chrg.service';

describe('CustomerChrgService', () => {
  let service: CustomerChrgService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerChrgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
