import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTripsheetComponent } from './view-tripsheet.component';

describe('ViewTripsheetComponent', () => {
  let component: ViewTripsheetComponent;
  let fixture: ComponentFixture<ViewTripsheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTripsheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTripsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
