import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustBookingComponent } from './add-cust-booking.component';

describe('AddCustBookingComponent', () => {
  let component: AddCustBookingComponent;
  let fixture: ComponentFixture<AddCustBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCustBookingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCustBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
