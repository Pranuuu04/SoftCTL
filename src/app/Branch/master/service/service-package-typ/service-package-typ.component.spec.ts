import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicePackageTypComponent } from './service-package-typ.component';

describe('ServicePackageTypComponent', () => {
  let component: ServicePackageTypComponent;
  let fixture: ComponentFixture<ServicePackageTypComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicePackageTypComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicePackageTypComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
