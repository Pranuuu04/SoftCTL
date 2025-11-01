import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockInReportComponent } from './stock-in-report.component';

describe('StockInReportComponent', () => {
  let component: StockInReportComponent;
  let fixture: ComponentFixture<StockInReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockInReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockInReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
