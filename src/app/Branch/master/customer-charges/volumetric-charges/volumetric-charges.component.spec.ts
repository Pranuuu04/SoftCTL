import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolumetricChargesComponent } from './volumetric-charges.component';

describe('VolumetricChargesComponent', () => {
  let component: VolumetricChargesComponent;
  let fixture: ComponentFixture<VolumetricChargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VolumetricChargesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VolumetricChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
