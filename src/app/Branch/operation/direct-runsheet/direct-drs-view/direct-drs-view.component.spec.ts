import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectDrsViewComponent } from './direct-drs-view.component';

describe('DirectDrsViewComponent', () => {
  let component: DirectDrsViewComponent;
  let fixture: ComponentFixture<DirectDrsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectDrsViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectDrsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
