import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripArrivalComponent } from './trip-arrival.component';

describe('TripArrivalComponent', () => {
  let component: TripArrivalComponent;
  let fixture: ComponentFixture<TripArrivalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripArrivalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripArrivalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
