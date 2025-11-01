import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunSheetComponent } from './run-sheet.component';

describe('RunSheetComponent', () => {
  let component: RunSheetComponent;
  let fixture: ComponentFixture<RunSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RunSheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RunSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
