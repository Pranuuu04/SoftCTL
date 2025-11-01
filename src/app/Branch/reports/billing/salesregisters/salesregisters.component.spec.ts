import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesregistersComponent } from './salesregisters.component';

describe('SalesregistersComponent', () => {
  let component: SalesregistersComponent;
  let fixture: ComponentFixture<SalesregistersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesregistersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesregistersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
