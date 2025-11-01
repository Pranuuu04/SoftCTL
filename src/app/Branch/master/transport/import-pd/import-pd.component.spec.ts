import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportPDComponent } from './import-pd.component';

describe('ImportPDComponent', () => {
  let component: ImportPDComponent;
  let fixture: ComponentFixture<ImportPDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportPDComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportPDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
