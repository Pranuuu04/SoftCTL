import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoneAwbComponent } from './done-awb.component';

describe('DoneAwbComponent', () => {
  let component: DoneAwbComponent;
  let fixture: ComponentFixture<DoneAwbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoneAwbComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoneAwbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
