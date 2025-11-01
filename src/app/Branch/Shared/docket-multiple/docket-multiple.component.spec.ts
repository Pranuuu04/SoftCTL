import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocketMultipleComponent } from './docket-multiple.component';

describe('DocketMultipleComponent', () => {
  let component: DocketMultipleComponent;
  let fixture: ComponentFixture<DocketMultipleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocketMultipleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocketMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
