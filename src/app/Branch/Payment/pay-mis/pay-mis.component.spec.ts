import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayMISComponent } from './pay-mis.component';

describe('PayMISComponent', () => {
  let component: PayMISComponent;
  let fixture: ComponentFixture<PayMISComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayMISComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayMISComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
