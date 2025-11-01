import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsignorMastComponent } from './consignor-mast.component';

describe('ConsignorMastComponent', () => {
  let component: ConsignorMastComponent;
  let fixture: ComponentFixture<ConsignorMastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsignorMastComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsignorMastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
