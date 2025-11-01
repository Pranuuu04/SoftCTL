import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripsheetComponent } from './tripsheet.component';

describe('TripsheetComponent', () => {
  let component: TripsheetComponent;
  let fixture: ComponentFixture<TripsheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripsheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
