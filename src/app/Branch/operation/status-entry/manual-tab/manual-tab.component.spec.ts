import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualTabComponent } from './manual-tab.component';

describe('ManualTabComponent', () => {
  let component: ManualTabComponent;
  let fixture: ComponentFixture<ManualTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManualTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
