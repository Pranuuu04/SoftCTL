import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwbBulkComponent } from './awb-bulk.component';

describe('AwbBulkComponent', () => {
  let component: AwbBulkComponent;
  let fixture: ComponentFixture<AwbBulkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AwbBulkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AwbBulkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
