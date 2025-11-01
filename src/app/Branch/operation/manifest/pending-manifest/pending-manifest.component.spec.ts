import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingManifestComponent } from './pending-manifest.component';

describe('PendingManifestComponent', () => {
  let component: PendingManifestComponent;
  let fixture: ComponentFixture<PendingManifestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingManifestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingManifestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});




