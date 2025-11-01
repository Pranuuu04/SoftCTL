import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceDeliverytypeComponent } from './service-deliverytype.component';

describe('ServiceDeliverytypeComponent', () => {
  let component: ServiceDeliverytypeComponent;
  let fixture: ComponentFixture<ServiceDeliverytypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceDeliverytypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceDeliverytypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
