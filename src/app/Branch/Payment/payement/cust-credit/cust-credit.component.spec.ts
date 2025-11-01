import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustCreditComponent } from './cust-credit.component';

describe('CustCreditComponent', () => {
  let component: CustCreditComponent;
  let fixture: ComponentFixture<CustCreditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustCreditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustCreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
