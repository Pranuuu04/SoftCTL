import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripImportComponent } from './trip-import.component';

describe('TripImportComponent', () => {
  let component: TripImportComponent;
  let fixture: ComponentFixture<TripImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripImportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
