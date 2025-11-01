import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsermanagementBookingComponent } from './usermanagement-booking.component';

describe('UsermanagementBookingComponent', () => {
  let component: UsermanagementBookingComponent;
  let fixture: ComponentFixture<UsermanagementBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsermanagementBookingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsermanagementBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
