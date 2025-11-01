import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDispatchedComponent } from './create-dispatched.component';

describe('CreateDispatchedComponent', () => {
  let component: CreateDispatchedComponent;
  let fixture: ComponentFixture<CreateDispatchedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDispatchedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDispatchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
