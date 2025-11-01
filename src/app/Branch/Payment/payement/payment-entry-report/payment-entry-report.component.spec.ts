import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentEntryReportComponent } from './payment-entry-report.component';

describe('PaymentEntryReportComponent', () => {
  let component: PaymentEntryReportComponent;
  let fixture: ComponentFixture<PaymentEntryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentEntryReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentEntryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
