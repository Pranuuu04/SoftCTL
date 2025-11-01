import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditRateUpdationComponent } from './audit-rate-updation.component';

describe('AuditRateUpdationComponent', () => {
  let component: AuditRateUpdationComponent;
  let fixture: ComponentFixture<AuditRateUpdationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditRateUpdationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditRateUpdationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
