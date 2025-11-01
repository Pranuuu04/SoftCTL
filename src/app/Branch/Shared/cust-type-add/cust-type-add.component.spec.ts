import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustTypeAddComponent } from './cust-type-add.component';

describe('CustTypeAddComponent', () => {
  let component: CustTypeAddComponent;
  let fixture: ComponentFixture<CustTypeAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustTypeAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustTypeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
