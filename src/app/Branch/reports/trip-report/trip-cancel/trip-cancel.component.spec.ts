import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripCancelComponent } from './trip-cancel.component';

describe('TripCancelComponent', () => {
  let component: TripCancelComponent;
  let fixture: ComponentFixture<TripCancelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripCancelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
