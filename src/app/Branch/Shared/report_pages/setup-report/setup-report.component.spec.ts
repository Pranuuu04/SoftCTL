import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupReportComponent } from './setup-report.component';

describe('SetupReportComponent', () => {
  let component: SetupReportComponent;
  let fixture: ComponentFixture<SetupReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetupReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetupReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
