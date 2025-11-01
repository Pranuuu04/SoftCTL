import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceChargesComponent } from './insurance-charges.component';

describe('InsuranceChargesComponent', () => {
  let component: InsuranceChargesComponent;
  let fixture: ComponentFixture<InsuranceChargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceChargesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsuranceChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
