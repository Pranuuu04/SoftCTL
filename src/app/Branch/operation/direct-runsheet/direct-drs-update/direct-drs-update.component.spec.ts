import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectDrsUpdateComponent } from './direct-drs-update.component';

describe('DirectDrsUpdateComponent', () => {
  let component: DirectDrsUpdateComponent;
  let fixture: ComponentFixture<DirectDrsUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectDrsUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectDrsUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
