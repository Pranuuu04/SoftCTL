import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentEntryBillComponent } from './payment-entry-bill.component';

describe('PaymentEntryBillComponent', () => {
  let component: PaymentEntryBillComponent;
  let fixture: ComponentFixture<PaymentEntryBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentEntryBillComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentEntryBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
