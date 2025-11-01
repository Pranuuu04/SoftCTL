import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnableLabelComponent } from './enable-label.component';

describe('EnableLabelComponent', () => {
  let component: EnableLabelComponent;
  let fixture: ComponentFixture<EnableLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnableLabelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnableLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
