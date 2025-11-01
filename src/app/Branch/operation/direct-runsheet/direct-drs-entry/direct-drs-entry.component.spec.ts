import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectDrsEntryComponent } from './direct-drs-entry.component';

describe('DirectDrsEntryComponent', () => {
  let component: DirectDrsEntryComponent;
  let fixture: ComponentFixture<DirectDrsEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectDrsEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectDrsEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
