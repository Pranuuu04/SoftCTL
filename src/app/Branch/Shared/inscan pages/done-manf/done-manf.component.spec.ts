import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoneManfComponent } from './done-manf.component';

describe('DoneManfComponent', () => {
  let component: DoneManfComponent;
  let fixture: ComponentFixture<DoneManfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoneManfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoneManfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
