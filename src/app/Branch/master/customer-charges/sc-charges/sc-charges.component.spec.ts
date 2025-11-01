import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScChargesComponent } from './sc-charges.component';

describe('ScChargesComponent', () => {
  let component: ScChargesComponent;
  let fixture: ComponentFixture<ScChargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScChargesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
