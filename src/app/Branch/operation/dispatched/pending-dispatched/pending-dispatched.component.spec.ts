import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingDispatchedComponent } from './pending-dispatched.component';

describe('PendingDispatchedComponent', () => {
  let component: PendingDispatchedComponent;
  let fixture: ComponentFixture<PendingDispatchedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingDispatchedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingDispatchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
