import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EssChargesComponent } from './ess-charges.component';

describe('EssChargesComponent', () => {
  let component: EssChargesComponent;
  let fixture: ComponentFixture<EssChargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EssChargesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EssChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
