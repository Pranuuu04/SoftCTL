import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateBulkComponent } from './generate-bulk.component';

describe('GenerateBulkComponent', () => {
  let component: GenerateBulkComponent;
  let fixture: ComponentFixture<GenerateBulkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateBulkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateBulkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
