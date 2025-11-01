import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForwadingManifestComponent } from './forwading-manifest.component';

describe('ForwadingManifestComponent', () => {
  let component: ForwadingManifestComponent;
  let fixture: ComponentFixture<ForwadingManifestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForwadingManifestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForwadingManifestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
