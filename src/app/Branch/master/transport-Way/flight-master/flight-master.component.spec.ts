import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightMasterComponent } from './flight-master.component';

describe('FlightMasterComponent', () => {
  let component: FlightMasterComponent;
  let fixture: ComponentFixture<FlightMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlightMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
