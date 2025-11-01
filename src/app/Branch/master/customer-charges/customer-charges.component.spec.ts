import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerChargesComponent } from './customer-charges.component';

describe('CustomerChargesComponent', () => {
  let component: CustomerChargesComponent;
  let fixture: ComponentFixture<CustomerChargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerChargesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
