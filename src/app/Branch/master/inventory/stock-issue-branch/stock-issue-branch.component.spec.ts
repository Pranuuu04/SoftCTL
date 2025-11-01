import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockIssueBranchComponent } from './stock-issue-branch.component';

describe('StockIssueBranchComponent', () => {
  let component: StockIssueBranchComponent;
  let fixture: ComponentFixture<StockIssueBranchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockIssueBranchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockIssueBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
