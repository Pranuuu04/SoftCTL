import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainNumberComponent } from './train-number.component';

describe('TrainNumberComponent', () => {
  let component: TrainNumberComponent;
  let fixture: ComponentFixture<TrainNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainNumberComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
