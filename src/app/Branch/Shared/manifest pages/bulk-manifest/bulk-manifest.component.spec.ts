import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkManifestComponent } from './bulk-manifest.component';

describe('BulkManifestComponent', () => {
  let component: BulkManifestComponent;
  let fixture: ComponentFixture<BulkManifestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkManifestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkManifestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
