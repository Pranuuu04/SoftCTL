import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentEntryBillReportComponent } from './payment-entry-bill-report.component';

describe('PaymentEntryBillReportComponent', () => {
  let component: PaymentEntryBillReportComponent;
  let fixture: ComponentFixture<PaymentEntryBillReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentEntryBillReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentEntryBillReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
