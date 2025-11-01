import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainMasterComponent } from './train-master.component';

describe('TrainMasterComponent', () => {
  let component: TrainMasterComponent;
  let fixture: ComponentFixture<TrainMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
