import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GstBookingComponent } from './gst-booking.component';

describe('GstBookingComponent', () => {
  let component: GstBookingComponent;
  let fixture: ComponentFixture<GstBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GstBookingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GstBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
