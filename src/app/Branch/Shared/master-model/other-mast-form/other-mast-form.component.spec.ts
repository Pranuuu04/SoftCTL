import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherMastFormComponent } from './other-mast-form.component';

describe('OtherMastFormComponent', () => {
  let component: OtherMastFormComponent;
  let fixture: ComponentFixture<OtherMastFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherMastFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherMastFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
