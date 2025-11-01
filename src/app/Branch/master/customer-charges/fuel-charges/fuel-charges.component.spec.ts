import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelChargesComponent } from './fuel-charges.component';

describe('FuelChargesComponent', () => {
  let component: FuelChargesComponent;
  let fixture: ComponentFixture<FuelChargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FuelChargesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuelChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
