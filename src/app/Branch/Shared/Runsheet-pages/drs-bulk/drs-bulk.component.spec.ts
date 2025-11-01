import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrsBulkComponent } from './drs-bulk.component';

describe('DrsBulkComponent', () => {
  let component: DrsBulkComponent;
  let fixture: ComponentFixture<DrsBulkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrsBulkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrsBulkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
