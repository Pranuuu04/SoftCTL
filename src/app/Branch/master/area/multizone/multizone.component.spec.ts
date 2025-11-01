import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultizoneComponent } from './multizone.component';

describe('MultizoneComponent', () => {
  let component: MultizoneComponent;
  let fixture: ComponentFixture<MultizoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultizoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultizoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
