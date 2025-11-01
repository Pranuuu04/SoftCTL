import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditBookingComponent } from './audit-booking.component';

describe('AuditBookingComponent', () => {
  let component: AuditBookingComponent;
  let fixture: ComponentFixture<AuditBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditBookingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
