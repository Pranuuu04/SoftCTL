import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesRateComponent } from './sales-rate.component';

describe('SalesRateComponent', () => {
  let component: SalesRateComponent;
  let fixture: ComponentFixture<SalesRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesRateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
