import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingDRSComponent } from './pending-drs.component';

describe('PendingDRSComponent', () => {
  let component: PendingDRSComponent;
  let fixture: ComponentFixture<PendingDRSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingDRSComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingDRSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
