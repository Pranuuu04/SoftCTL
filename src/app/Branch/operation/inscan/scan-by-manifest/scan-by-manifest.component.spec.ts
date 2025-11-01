import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanByManifestComponent } from './scan-by-manifest.component';

describe('ScanByManifestComponent', () => {
  let component: ScanByManifestComponent;
  let fixture: ComponentFixture<ScanByManifestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScanByManifestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScanByManifestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
