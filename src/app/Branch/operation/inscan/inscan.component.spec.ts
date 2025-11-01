import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscanComponent } from './inscan.component';

describe('InscanComponent', () => {
  let component: InscanComponent;
  let fixture: ComponentFixture<InscanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InscanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InscanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
