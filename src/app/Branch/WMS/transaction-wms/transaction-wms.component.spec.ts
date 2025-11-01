import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionWmsComponent } from './transaction-wms.component';

describe('TransactionWmsComponent', () => {
  let component: TransactionWmsComponent;
  let fixture: ComponentFixture<TransactionWmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionWmsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionWmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
