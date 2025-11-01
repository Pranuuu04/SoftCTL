import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverdPodComponent } from './deliverd-pod.component';

describe('DeliverdPodComponent', () => {
  let component: DeliverdPodComponent;
  let fixture: ComponentFixture<DeliverdPodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliverdPodComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliverdPodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
