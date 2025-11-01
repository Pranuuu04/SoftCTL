import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransTypeComponent } from './trans-type.component';

describe('TransTypeComponent', () => {
  let component: TransTypeComponent;
  let fixture: ComponentFixture<TransTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
