import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashTopayComponent } from './cash-topay.component';

describe('CashTopayComponent', () => {
  let component: CashTopayComponent;
  let fixture: ComponentFixture<CashTopayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashTopayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashTopayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
