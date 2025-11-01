import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewdeleteComponent } from './viewdelete.component';

describe('ViewdeleteComponent', () => {
  let component: ViewdeleteComponent;
  let fixture: ComponentFixture<ViewdeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewdeleteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewdeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
