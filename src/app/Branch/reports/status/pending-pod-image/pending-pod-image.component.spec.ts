import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingPodImageComponent } from './pending-pod-image.component';

describe('PendingPodImageComponent', () => {
  let component: PendingPodImageComponent;
  let fixture: ComponentFixture<PendingPodImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingPodImageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingPodImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
