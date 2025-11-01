import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingPickUpComponent } from './pending-pick-up.component';

describe('PendingPickUpComponent', () => {
  let component: PendingPickUpComponent;
  let fixture: ComponentFixture<PendingPickUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingPickUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingPickUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
