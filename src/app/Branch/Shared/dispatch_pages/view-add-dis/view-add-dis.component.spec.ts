import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAddDisComponent } from './view-add-dis.component';

describe('ViewAddDisComponent', () => {
  let component: ViewAddDisComponent;
  let fixture: ComponentFixture<ViewAddDisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAddDisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAddDisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
