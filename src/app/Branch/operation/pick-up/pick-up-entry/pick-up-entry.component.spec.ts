import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickUpEntryComponent } from './pick-up-entry.component';

describe('PickUpEntryComponent', () => {
  let component: PickUpEntryComponent;
  let fixture: ComponentFixture<PickUpEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PickUpEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PickUpEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
