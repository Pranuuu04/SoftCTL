import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransVehicleComponent } from './trans-vehicle.component';

describe('TransVehicleComponent', () => {
  let component: TransVehicleComponent;
  let fixture: ComponentFixture<TransVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransVehicleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
