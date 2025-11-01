import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashCustViewComponent } from './dash-cust-view.component';

describe('DashCustViewComponent', () => {
  let component: DashCustViewComponent;
  let fixture: ComponentFixture<DashCustViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashCustViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashCustViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
