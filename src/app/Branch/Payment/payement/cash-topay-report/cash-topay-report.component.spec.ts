import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CastTopayReportComponent } from './cash-topay-report.component';

describe('CastTopayReportComponent', () => {
  let component: CastTopayReportComponent;
  let fixture: ComponentFixture<CastTopayReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CastTopayReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CastTopayReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
