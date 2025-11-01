import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintBookingComponent } from './print-booking.component';

describe('PrintBookingComponent', () => {
  let component: PrintBookingComponent;
  let fixture: ComponentFixture<PrintBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintBookingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
