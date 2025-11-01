import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetroChargesComponent } from './metro-charges.component';

describe('MetroChargesComponent', () => {
  let component: MetroChargesComponent;
  let fixture: ComponentFixture<MetroChargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetroChargesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetroChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
