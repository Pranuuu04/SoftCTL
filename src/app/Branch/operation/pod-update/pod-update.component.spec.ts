import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PodUpdateComponent } from './pod-update.component';

describe('PodUpdateComponent', () => {
  let component: PodUpdateComponent;
  let fixture: ComponentFixture<PodUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PodUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PodUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
