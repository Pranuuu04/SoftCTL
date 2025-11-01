import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocketChargesComponent } from './docket-charges.component';

describe('DocketChargesComponent', () => {
  let component: DocketChargesComponent;
  let fixture: ComponentFixture<DocketChargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocketChargesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocketChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
