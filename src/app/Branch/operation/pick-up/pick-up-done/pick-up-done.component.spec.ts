import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickUpDoneComponent } from './pick-up-done.component';

describe('PickUpDoneComponent', () => {
  let component: PickUpDoneComponent;
  let fixture: ComponentFixture<PickUpDoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PickUpDoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PickUpDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
