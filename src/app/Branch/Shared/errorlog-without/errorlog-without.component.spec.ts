import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorlogWithoutComponent } from './errorlog-without.component';

describe('ErrorlogWithoutComponent', () => {
  let component: ErrorlogWithoutComponent;
  let fixture: ComponentFixture<ErrorlogWithoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorlogWithoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorlogWithoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
