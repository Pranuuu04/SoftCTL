import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingTabComponent } from './booking-tab.component';

describe('BookingTabComponent', () => {
  let component: BookingTabComponent;
  let fixture: ComponentFixture<BookingTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
