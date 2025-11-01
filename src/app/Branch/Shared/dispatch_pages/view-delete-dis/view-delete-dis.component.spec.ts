import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDeleteDisComponent } from './view-delete-dis.component';

describe('ViewDeleteDisComponent', () => {
  let component: ViewDeleteDisComponent;
  let fixture: ComponentFixture<ViewDeleteDisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDeleteDisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDeleteDisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
