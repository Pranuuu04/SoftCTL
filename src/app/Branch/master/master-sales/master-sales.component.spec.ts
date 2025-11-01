import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterSalesComponent } from './master-sales.component';

describe('MasterSalesComponent', () => {
  let component: MasterSalesComponent;
  let fixture: ComponentFixture<MasterSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterSalesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
