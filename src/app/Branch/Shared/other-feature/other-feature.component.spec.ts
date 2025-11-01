import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherFeatureComponent } from './other-feature.component';

describe('OtherFeatureComponent', () => {
  let component: OtherFeatureComponent;
  let fixture: ComponentFixture<OtherFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherFeatureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
