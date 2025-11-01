import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CafChargesComponent } from './caf-charges.component';

describe('CafChargesComponent', () => {
  let component: CafChargesComponent;
  let fixture: ComponentFixture<CafChargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CafChargesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CafChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
