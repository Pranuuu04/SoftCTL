import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PODCancleComponent } from './pod-cancle.component';

describe('PODCancleComponent', () => {
  let component: PODCancleComponent;
  let fixture: ComponentFixture<PODCancleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PODCancleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PODCancleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
