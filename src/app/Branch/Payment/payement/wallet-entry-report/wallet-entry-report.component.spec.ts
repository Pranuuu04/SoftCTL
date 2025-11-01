import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletEntryReportComponent } from './wallet-entry-report.component';

describe('WalletEntryReportComponent', () => {
  let component: WalletEntryReportComponent;
  let fixture: ComponentFixture<WalletEntryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletEntryReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletEntryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
