import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnbuiltComponent } from './unbuilt.component';

describe('UnbuiltComponent', () => {
  let component: UnbuiltComponent;
  let fixture: ComponentFixture<UnbuiltComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnbuiltComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnbuiltComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
