import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VieweditComponent } from './viewedit.component';

describe('VieweditComponent', () => {
  let component: VieweditComponent;
  let fixture: ComponentFixture<VieweditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VieweditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VieweditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
