import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnbuildBillingComponent } from './unbuild-billing.component';

describe('UnbuildBillingComponent', () => {
  let component: UnbuildBillingComponent;
  let fixture: ComponentFixture<UnbuildBillingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnbuildBillingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnbuildBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
