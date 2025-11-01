import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectDrsPendingComponent } from './direct-drs-pending.component';

describe('DirectDrsPendingComponent', () => {
  let component: DirectDrsPendingComponent;
  let fixture: ComponentFixture<DirectDrsPendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectDrsPendingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectDrsPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
