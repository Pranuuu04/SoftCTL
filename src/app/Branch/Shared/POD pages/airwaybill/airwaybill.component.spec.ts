import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirwaybillComponent } from './airwaybill.component';

describe('AirwaybillComponent', () => {
  let component: AirwaybillComponent;
  let fixture: ComponentFixture<AirwaybillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AirwaybillComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AirwaybillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
