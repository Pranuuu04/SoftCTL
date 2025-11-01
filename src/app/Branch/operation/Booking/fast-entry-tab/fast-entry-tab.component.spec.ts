import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FastEntryTabComponent } from './fast-entry-tab.component';

describe('FastEntryTabComponent', () => {
  let component: FastEntryTabComponent;
  let fixture: ComponentFixture<FastEntryTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FastEntryTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FastEntryTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
