import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectPodComponent } from './direct-pod.component';

describe('DirectPodComponent', () => {
  let component: DirectPodComponent;
  let fixture: ComponentFixture<DirectPodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectPodComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectPodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
