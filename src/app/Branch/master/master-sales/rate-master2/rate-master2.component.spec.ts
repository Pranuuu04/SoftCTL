import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateMaster2Component } from './rate-master2.component';

describe('RateMaster2Component', () => {
  let component: RateMaster2Component;
  let fixture: ComponentFixture<RateMaster2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RateMaster2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RateMaster2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
