import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransStockInComponent } from './trans-stock-in.component';

describe('TransStockInComponent', () => {
  let component: TransStockInComponent;
  let fixture: ComponentFixture<TransStockInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransStockInComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransStockInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
