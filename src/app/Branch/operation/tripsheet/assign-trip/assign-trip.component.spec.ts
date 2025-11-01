import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignTripComponent } from './assign-trip.component';

describe('AssignTripComponent', () => {
  let component: AssignTripComponent;
  let fixture: ComponentFixture<AssignTripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignTripComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
