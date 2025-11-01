import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DRSViewComponent } from './drs-view.component';

describe('DRSViewComponent', () => {
  let component: DRSViewComponent;
  let fixture: ComponentFixture<DRSViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DRSViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DRSViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
