import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDrsComponent } from './add-drs.component';

describe('AddDrsComponent', () => {
  let component: AddDrsComponent;
  let fixture: ComponentFixture<AddDrsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDrsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
