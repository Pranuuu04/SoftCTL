import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorboxComponent } from './vendorbox.component';

describe('VendorboxComponent', () => {
  let component: VendorboxComponent;
  let fixture: ComponentFixture<VendorboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorboxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
