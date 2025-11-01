import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewaddComponent } from './viewadd.component';

describe('ViewaddComponent', () => {
  let component: ViewaddComponent;
  let fixture: ComponentFixture<ViewaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewaddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
