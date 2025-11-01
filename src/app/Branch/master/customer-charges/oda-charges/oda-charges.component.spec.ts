import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OdaChargesComponent } from './oda-charges.component';

describe('OdaChargesComponent', () => {
  let component: OdaChargesComponent;
  let fixture: ComponentFixture<OdaChargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OdaChargesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OdaChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
