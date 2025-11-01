import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectRunsheetComponent } from './direct-runsheet.component';

describe('DirectRunsheetComponent', () => {
  let component: DirectRunsheetComponent;
  let fixture: ComponentFixture<DirectRunsheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectRunsheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectRunsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
