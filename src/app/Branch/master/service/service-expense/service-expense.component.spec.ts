import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceExpenseComponent } from './service-expense.component';

describe('ServiceExpenseComponent', () => {
  let component: ServiceExpenseComponent;
  let fixture: ComponentFixture<ServiceExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceExpenseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
