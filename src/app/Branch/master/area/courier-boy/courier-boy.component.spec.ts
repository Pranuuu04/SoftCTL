import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierBoyComponent } from './courier-boy.component';

describe('CourierBoyComponent', () => {
  let component: CourierBoyComponent;
  let fixture: ComponentFixture<CourierBoyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourierBoyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourierBoyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
