import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTripsheetComponent } from './create-tripsheet.component';

describe('CreateTripsheetComponent', () => {
  let component: CreateTripsheetComponent;
  let fixture: ComponentFixture<CreateTripsheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTripsheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTripsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
