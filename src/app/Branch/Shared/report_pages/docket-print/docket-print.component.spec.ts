import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocketPrintComponent } from './docket-print.component';

describe('DocketPrintComponent', () => {
  let component: DocketPrintComponent;
  let fixture: ComponentFixture<DocketPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocketPrintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocketPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
