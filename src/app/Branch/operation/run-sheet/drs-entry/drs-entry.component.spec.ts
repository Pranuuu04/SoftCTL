import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DRSEntryComponent } from './drs-entry.component';

describe('DRSEntryComponent', () => {
  let component: DRSEntryComponent;
  let fixture: ComponentFixture<DRSEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DRSEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DRSEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
