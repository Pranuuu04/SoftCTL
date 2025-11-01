import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UndeliverdComponent } from './undeliverd.component';

describe('UndeliverdComponent', () => {
  let component: UndeliverdComponent;
  let fixture: ComponentFixture<UndeliverdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UndeliverdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UndeliverdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
