import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatePrintComponent } from './rate-print.component';

describe('RatePrintComponent', () => {
  let component: RatePrintComponent;
  let fixture: ComponentFixture<RatePrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RatePrintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RatePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
