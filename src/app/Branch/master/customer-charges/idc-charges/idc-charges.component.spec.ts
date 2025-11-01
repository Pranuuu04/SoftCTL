import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdcChargesComponent } from './idc-charges.component';

describe('IdcChargesComponent', () => {
  let component: IdcChargesComponent;
  let fixture: ComponentFixture<IdcChargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdcChargesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdcChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
