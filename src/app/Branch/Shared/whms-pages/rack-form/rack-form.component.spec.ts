import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RackFormComponent } from './rack-form.component';

describe('RackFormComponent', () => {
  let component: RackFormComponent;
  let fixture: ComponentFixture<RackFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RackFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RackFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
