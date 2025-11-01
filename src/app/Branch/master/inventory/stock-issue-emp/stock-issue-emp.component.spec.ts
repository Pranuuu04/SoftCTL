import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockIssueEMPComponent } from './stock-issue-emp.component';

describe('StockIssueEMPComponent', () => {
  let component: StockIssueEMPComponent;
  let fixture: ComponentFixture<StockIssueEMPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockIssueEMPComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockIssueEMPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
