import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolumatricReportComponent } from './volumatric-report.component';

describe('VolumatricReportComponent', () => {
  let component: VolumatricReportComponent;
  let fixture: ComponentFixture<VolumatricReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VolumatricReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VolumatricReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
