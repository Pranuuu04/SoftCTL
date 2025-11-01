import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingChecklistComponent } from './billing-checklist.component';

describe('BillingChecklistComponent', () => {
  let component: BillingChecklistComponent;
  let fixture: ComponentFixture<BillingChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillingChecklistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillingChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
