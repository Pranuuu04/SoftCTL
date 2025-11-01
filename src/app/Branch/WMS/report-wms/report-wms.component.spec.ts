import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportWMSComponent } from './report-wms.component';

describe('ReportWMSComponent', () => {
  let component: ReportWMSComponent;
  let fixture: ComponentFixture<ReportWMSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportWMSComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportWMSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
