import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmViewComponent } from './crm-view.component';

describe('CrmViewComponent', () => {
  let component: CrmViewComponent;
  let fixture: ComponentFixture<CrmViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrmViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrmViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
