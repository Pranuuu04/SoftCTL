import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportDrsComponent } from './import-drs.component';

describe('ImportDrsComponent', () => {
  let component: ImportDrsComponent;
  let fixture: ComponentFixture<ImportDrsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportDrsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportDrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
