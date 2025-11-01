import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCustBookingComponent } from './edit-cust-booking.component';

describe('EditCustBookingComponent', () => {
  let component: EditCustBookingComponent;
  let fixture: ComponentFixture<EditCustBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCustBookingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCustBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
