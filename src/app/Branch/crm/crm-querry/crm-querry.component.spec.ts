import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmQuerryComponent } from './crm-querry.component';

describe('CrmQuerryComponent', () => {
  let component: CrmQuerryComponent;
  let fixture: ComponentFixture<CrmQuerryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrmQuerryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrmQuerryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
