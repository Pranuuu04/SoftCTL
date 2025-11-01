import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustChargFormComponent } from './cust-charg-form.component';

describe('CustChargFormComponent', () => {
  let component: CustChargFormComponent;
  let fixture: ComponentFixture<CustChargFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustChargFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustChargFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
