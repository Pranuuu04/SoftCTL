import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManifestBulkComponent } from './manifest-bulk.component';

describe('ManifestBulkComponent', () => {
  let component: ManifestBulkComponent;
  let fixture: ComponentFixture<ManifestBulkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManifestBulkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManifestBulkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
