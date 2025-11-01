import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaDestComponent } from './area-dest.component';

describe('AreaDestComponent', () => {
  let component: AreaDestComponent;
  let fixture: ComponentFixture<AreaDestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AreaDestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreaDestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
