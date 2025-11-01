import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewManifestComponent } from './view-manifest.component';

describe('ViewManifestComponent', () => {
  let component: ViewManifestComponent;
  let fixture: ComponentFixture<ViewManifestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewManifestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewManifestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
