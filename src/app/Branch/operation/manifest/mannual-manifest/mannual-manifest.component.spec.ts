import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MannualManifestComponent } from './mannual-manifest.component';

describe('MannualManifestComponent', () => {
  let component: MannualManifestComponent;
  let fixture: ComponentFixture<MannualManifestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MannualManifestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MannualManifestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
