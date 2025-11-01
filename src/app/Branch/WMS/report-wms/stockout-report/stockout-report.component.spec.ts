import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockoutReportComponent } from './stockout-report.component';

describe('StockoutReportComponent', () => {
  let component: StockoutReportComponent;
  let fixture: ComponentFixture<StockoutReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockoutReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockoutReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
