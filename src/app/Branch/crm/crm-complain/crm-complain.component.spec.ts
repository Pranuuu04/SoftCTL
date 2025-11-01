import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmComplainComponent } from './crm-complain.component';

describe('CrmComplainComponent', () => {
  let component: CrmComplainComponent;
  let fixture: ComponentFixture<CrmComplainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrmComplainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrmComplainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
