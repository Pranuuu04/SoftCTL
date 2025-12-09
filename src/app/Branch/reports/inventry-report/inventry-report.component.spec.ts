import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventryReportComponent } from './inventry-report.component';

describe('InventryReportComponent', () => {
  let component: InventryReportComponent;
  let fixture: ComponentFixture<InventryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventryReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
