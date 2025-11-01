import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransStockOutComponent } from './trans-stock-out.component';

describe('TransStockOutComponent', () => {
  let component: TransStockOutComponent;
  let fixture: ComponentFixture<TransStockOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransStockOutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransStockOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
