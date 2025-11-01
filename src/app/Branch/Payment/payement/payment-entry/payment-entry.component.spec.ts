import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentEntryComponent } from './payment-entry.component';

describe('PaymentEntryComponent', () => {
  let component: PaymentEntryComponent;
  let fixture: ComponentFixture<PaymentEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
