import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnsChargesComponent } from './ens-charges.component';

describe('EnsChargesComponent', () => {
  let component: EnsChargesComponent;
  let fixture: ComponentFixture<EnsChargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnsChargesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnsChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
