import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateImportComponent } from './rate-import.component';

describe('RateImportComponent', () => {
  let component: RateImportComponent;
  let fixture: ComponentFixture<RateImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RateImportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RateImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
