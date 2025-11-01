import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FovChargesComponent } from './fov-charges.component';

describe('FovChargesComponent', () => {
  let component: FovChargesComponent;
  let fixture: ComponentFixture<FovChargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FovChargesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FovChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
