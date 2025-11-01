import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingGenrateComponent } from './billing-genrate.component';

describe('BillingGenrateComponent', () => {
  let component: BillingGenrateComponent;
  let fixture: ComponentFixture<BillingGenrateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillingGenrateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillingGenrateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
