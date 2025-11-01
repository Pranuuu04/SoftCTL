import { TestBed } from '@angular/core/testing';

import { BranchDashService } from './branch-dash.service';

describe('BranchDashService', () => {
  let service: BranchDashService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BranchDashService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
