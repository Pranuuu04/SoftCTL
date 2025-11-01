import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleInscanComponent } from './vehicle-inscan.component';

describe('VehicleInscanComponent', () => {
  let component: VehicleInscanComponent;
  let fixture: ComponentFixture<VehicleInscanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleInscanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleInscanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
