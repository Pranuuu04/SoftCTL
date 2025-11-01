import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceReasonComponent } from './service-reason.component';

describe('ServiceReasonComponent', () => {
  let component: ServiceReasonComponent;
  let fixture: ComponentFixture<ServiceReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceReasonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
