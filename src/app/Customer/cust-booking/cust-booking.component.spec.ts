import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustBookingComponent } from './cust-booking.component';

describe('CustBookingComponent', () => {
  let component: CustBookingComponent;
  let fixture: ComponentFixture<CustBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustBookingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
