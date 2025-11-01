import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPickUpComponent } from './view-pick-up.component';

describe('ViewPickUpComponent', () => {
  let component: ViewPickUpComponent;
  let fixture: ComponentFixture<ViewPickUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPickUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPickUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
