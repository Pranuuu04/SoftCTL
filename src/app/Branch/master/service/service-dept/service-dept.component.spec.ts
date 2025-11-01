import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceDeptComponent } from './service-dept.component';

describe('ServiceDeptComponent', () => {
  let component: ServiceDeptComponent;
  let fixture: ComponentFixture<ServiceDeptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceDeptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceDeptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
