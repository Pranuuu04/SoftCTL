import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDispatchedComponent } from './view-dispatched.component';

describe('ViewDispatchedComponent', () => {
  let component: ViewDispatchedComponent;
  let fixture: ComponentFixture<ViewDispatchedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDispatchedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDispatchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
