import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockIssueCustomerComponent } from './stock-issue-customer.component';

describe('StockIssueCustomerComponent', () => {
  let component: StockIssueCustomerComponent;
  let fixture: ComponentFixture<StockIssueCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockIssueCustomerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockIssueCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
