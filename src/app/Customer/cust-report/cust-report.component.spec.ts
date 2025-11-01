import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustReportComponent } from './cust-report.component';

describe('CustReportComponent', () => {
  let component: CustReportComponent;
  let fixture: ComponentFixture<CustReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
