import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingCnoteComponent } from './missing-cnote.component';

describe('MissingCnoteComponent', () => {
  let component: MissingCnoteComponent;
  let fixture: ComponentFixture<MissingCnoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MissingCnoteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissingCnoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
