import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PInscanAwbNoComponent } from './p-inscan-awb-no.component';

describe('PInscanAwbNoComponent', () => {
  let component: PInscanAwbNoComponent;
  let fixture: ComponentFixture<PInscanAwbNoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PInscanAwbNoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PInscanAwbNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
