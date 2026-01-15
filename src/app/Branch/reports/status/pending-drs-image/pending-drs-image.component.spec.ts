import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingDrsImageComponent } from './pending-drs-image.component';

describe('PendingDrsImageComponent', () => {
  let component: PendingDrsImageComponent;
  let fixture: ComponentFixture<PendingDrsImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingDrsImageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingDrsImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
