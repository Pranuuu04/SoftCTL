import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UndeliverdPodComponent } from './undeliverd-pod.component';

describe('UndeliverdPodComponent', () => {
  let component: UndeliverdPodComponent;
  let fixture: ComponentFixture<UndeliverdPodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UndeliverdPodComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UndeliverdPodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
