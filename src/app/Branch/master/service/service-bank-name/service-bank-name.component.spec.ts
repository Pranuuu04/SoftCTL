import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceBankNameComponent } from './service-bank-name.component';

describe('ServiceBankNameComponent', () => {
  let component: ServiceBankNameComponent;
  let fixture: ComponentFixture<ServiceBankNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceBankNameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceBankNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
