import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EShipAPIComponent } from './e-ship-api.component';

describe('EShipAPIComponent', () => {
  let component: EShipAPIComponent;
  let fixture: ComponentFixture<EShipAPIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EShipAPIComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EShipAPIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
