import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrenchiseeLayoutComponent } from './frenchisee-layout.component';

describe('FrenchiseeLayoutComponent', () => {
  let component: FrenchiseeLayoutComponent;
  let fixture: ComponentFixture<FrenchiseeLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrenchiseeLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FrenchiseeLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
