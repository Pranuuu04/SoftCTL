import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripsheetRComponent } from './tripsheet-r.component';

describe('TripsheetRComponent', () => {
  let component: TripsheetRComponent;
  let fixture: ComponentFixture<TripsheetRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripsheetRComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripsheetRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
