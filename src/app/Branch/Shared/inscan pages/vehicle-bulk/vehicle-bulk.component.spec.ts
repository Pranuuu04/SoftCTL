import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleBulkComponent } from './vehicle-bulk.component';

describe('VehicleBulkComponent', () => {
  let component: VehicleBulkComponent;
  let fixture: ComponentFixture<VehicleBulkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleBulkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleBulkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
