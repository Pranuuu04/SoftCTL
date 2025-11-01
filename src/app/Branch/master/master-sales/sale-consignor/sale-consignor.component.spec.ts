import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleConsignorComponent } from './sale-consignor.component';

describe('SaleConsignorComponent', () => {
  let component: SaleConsignorComponent;
  let fixture: ComponentFixture<SaleConsignorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleConsignorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleConsignorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
