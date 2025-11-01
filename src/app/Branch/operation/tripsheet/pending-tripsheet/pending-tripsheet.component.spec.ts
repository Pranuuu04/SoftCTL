import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingTripsheetComponent } from './pending-tripsheet.component';

describe('PendingTripsheetComponent', () => {
  let component: PendingTripsheetComponent;
  let fixture: ComponentFixture<PendingTripsheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingTripsheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingTripsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
